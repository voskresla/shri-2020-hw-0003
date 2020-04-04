const express = require("express");
const router = express.Router();
const yndx_db_api = require("../api/yndx_ci");
const {
	gitClone,
	getLastCommit,
	getCommitInfo
} = require("../child_process/index");

// GET /api/settings
router.get("/", async (req, res, next) => {
	console.log("GET /api/settings");

	await new Promise(r =>
		setTimeout(
			r,
			Math.floor(Math.random() * (1000 - 2000 + 1) + 2000)
		)
	);
	yndx_db_api.get("/conf").then(r => {
		if (r.status === 200) {
			res.status(200).json(r.data.data)
		} else {
			res.status(500).end()
		}

	}).catch(next);
});

// POST /api/settings
router.post("/", (req, res, next) => {
	const settings = req.body;
	let tmpCommitHash = null;

	console.log("POST settings");

	if (!isValidConfigarationSettings(settings)) {
		console.log("POST settings не валидные настройки");
		next("Не валидные настройки");
		return;
	}

	// Паралелим клонирование и запись конфига. Будем вести свой лог-файл для
	// статуса клонирования. Сверятся с ним в остальных endpoint и выдавать ошибку
	// юзеру если клонирования не получилось.

	// Запускаем gitClone (он же проверяет есть ли такой репозиторий, если есть,
	// запустит git pull, если новый репозиторий - склонирует в ./repos)
	gitClone(settings)
		// запускаем последний коммит на билд
		// TODO: как-то проверяем что этот коммит уже был? Или сначала проверим
		// clone был или pull, а потом по ТЗ решим запускать последний коммит на
		// билд или нет?
		// или если сделаем очрередь то ставим последний коммит в очередь
		.then(async () => {
			console.log('Сохраняем настройки в хранилище')
			function sleep(ms) {
				return new Promise(resolve => setTimeout(resolve, ms));
			}

			await sleep(5000);

			return yndx_db_api
				.post("/conf", settings)

		})
		.then(() => {
			console.log("Клонирование успешно");
			return getLastCommit(settings);
		})
		.then(commitHash => {
			console.log('Получили последний коммит:', commitHash)
			// запомнили хэш, понадобиться дальше по цепочке. другого способа
			// протащить данные через несколько then пока не придумал.
			tmpCommitHash = commitHash;
			return getCommitInfo(commitHash, settings);
		})
		// поставили коммит в очередь
		.then(commitInfo => {
			console.log('Ставим сборку в очередь для:', commitInfo)
			return yndx_db_api.post("/build/request", commitInfo);
		})
		.then(() =>
			console.log(`Сборка для коммита ${tmpCommitHash} добавлена в очередь`)
		)
		.then(() => res.send("Конфигурация сохранена"))
		.catch(e => {

			if (e === 'clone-fail') {
				console.log('Ошибка клонирования репозитория.')
				res.statusMessage = 'Error'
				res.status(200).send({ message: 'Ошибка клонирования репозитория.' })
				return
			}

			res.statusMessage = 'Error'
			res.status(200).send({ message: 'Неизвестная ошибка на сервере.' })

			// next()

		})
});

router.delete("/", (req, res) => {
	yndx_db_api.delete("/conf").then(r => res.send("Конфигурация удалена."));
});

module.exports = router;

function isValidConfigarationSettings(settings) {
	const { repoName, buildCommand, mainBranch, period } = settings;
	if (typeof repoName !== "string" || repoName.split("/").length !== 2) {
		return false;
	}
	if (typeof repoName !== "string" || buildCommand.length === 0) {
		return false;
	}
	if (typeof mainBranch !== "string" || buildCommand.length === 0) {
		return false;
	}
	if (typeof period !== "number") {
		return false;
	}
	return true;
}
