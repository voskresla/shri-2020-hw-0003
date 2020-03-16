const express = require('express');
const router = express.Router();
const yndx_db_api = require('../api/yndx_ci');
const { gitClone, getLastCommit, getCommitInfo } = require('../child_process/index');

// GET /api/settings
router.get('/', (req, res) => {
  yndx_db_api.get('/conf').then(r => res.send(r.data.data));
});

// POST /api/settings
router.post('/', (req, res, next) => {
  const settings = req.body;
  let tmpCommitHash = null;

  if (!isValidConfigarationSettings(settings)) {
    next('Не валидные настройки');
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
    .then(() => {
      console.log('Клонирование успешно');
      return getLastCommit(settings);
    })
    .then(commitHash => {
      // запомнили хэш, понадобиться дальше по цепочке. другого способа
      // протащить данные через несколько then пока не придумал.
      tmpCommitHash = commitHash;
      return getCommitInfo(commitHash, settings);
    })
    // поставили коммит в очередь
    .then(commitInfo => {
      return yndx_db_api.post('/build/request', commitInfo);
    })
    .then(() => console.log(`Сборка для коммита ${tmpCommitHash} добавлена в очередь`))
    .catch(next);

  // Паралельно запустили сохранение настроек в базу.
  yndx_db_api
    .post('/conf', settings)
    .then(() => res.send('Конфигурация сохранена'))
    .catch(next);
});

router.delete('/', (req, res) => {
  yndx_db_api.delete('/conf').then(r => res.send('Конфигурация удалена.'));
});

module.exports = router;

function isValidConfigarationSettings(settings) {
  const { repoName, buildCommand, mainBranch, period } = settings;
  if (typeof repoName !== 'string' || repoName.split('/').length !== 2) {
    return false;
  }
  if (typeof repoName !== 'string' || buildCommand.length === 0) {
    return false;
  }
  if (typeof mainBranch !== 'string' || buildCommand.length === 0) {
    return false;
  }
  if (typeof period !== 'number') {
    return false;
  }
  return true;
}
