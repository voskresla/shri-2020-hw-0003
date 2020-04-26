
import express from 'express'

const router = express.Router()
import { yndxApi } from '../api/yndx_ci'
import {
	gitClone,
	getLastCommit,
	getCommitInfo,
} from '../child_process/index'

import { isValidConfigarationSettings } from './../utils/index'

export interface SettingsModel {
	id: string
	repoName: string
	buildCommand: string
	mainBranch: string
	period: number
}

router.get('/', async (req, res, next) => {
	console.log('GET /api/settings')

	await new Promise(r =>
		setTimeout(
			r,
			Math.floor(Math.random() * (1000 - 2000 + 1) + 2000),
		),
	)
	yndxApi.get('/conf').then(r => {
		if (r.status === 200) {
			res.status(200).json(r.data.data)
		} else {
			res.status(500).end()
		}

	}).catch(next)
})

// POST /api/settings
router.post('/', (req, res, next) => {
	const settings = req.body
	let tmpCommitHash: null | string = null

	console.log('POST settings')

	if (!isValidConfigarationSettings(settings)) {
		console.log('POST settings не валидные настройки')
		next('Не валидные настройки')
		return
	}

	gitClone(settings)
		.then(async () => {
			console.log('Сохраняем настройки в хранилище')
			function sleep(ms: number) {
				return new Promise(resolve => setTimeout(resolve, ms))
			}

			await sleep(5000)

			return yndxApi
				.post('/conf', settings)

		})
		.then(() => {
			console.log('Клонирование успешно')
			return getLastCommit(settings)
		})
		.then(commitHash => {
			console.log('Получили последний коммит:', commitHash)

			tmpCommitHash = commitHash
			return getCommitInfo(commitHash, settings)
		})
		.then(commitInfo => {
			console.log('Ставим сборку в очередь для:', commitInfo)
			return yndxApi.post('/build/request', commitInfo)
		})
		.then(() =>
			console.log(`Сборка для коммита ${tmpCommitHash} добавлена в очередь`),
		)
		.then(() => res.send('Конфигурация сохранена'))
		.catch(e => {

			if (e === 'clone-fail') {
				console.log('Ошибка клонирования репозитория.')
				res.statusMessage = 'Error'
				res.status(200).send({ message: 'Ошибка клонирования репозитория.' })
				return
			}

			res.statusMessage = 'Error'
			res.status(200).send({ message: 'Неизвестная ошибка на сервере.' })
		})
})

router.delete('/', (req, res) => {
	yndxApi.delete('/conf').then(() => res.send('Конфигурация удалена.'))
})

export const settingsRoutes = router


