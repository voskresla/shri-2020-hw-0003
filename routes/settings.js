const express = require('express');
const router = express.Router();
const yndx_db_api = require('../api/yndx_ci');
const { gitClone, getLastCommit, getCommitInfo } = require('../child_process/index');

// GET /api/settings
router.get('/', (req, res) => {
  yndx_db_api.get('/conf').then(r => res.send(r.data));
});

// POST /api/settings
router.post('/', (req, res, next) => {
  // пока что всегда возвращает true
  if (!isValidConfigarationSettings(req.body)) {
    return res.send('Не валидные настройки');
  }

  console.log('приехали настройки:', req.body);
  const settings = req.body || {
    repoName: 'voskresla/shri_2020_hw_0001',
    buildCommand: 'npm run build',
    mainBranch: 'master',
    period: 0,
  };
  let tmpCommitHash = null;

  // Паралелим клонирование и запись конфига. Будем вести свой лог-файл для
  // статуса клонирования. Сверятся с ним в остальных endpoint и выдавать ошибку
  // юзеру если клонирования не получилось.
  gitClone(settings)
    .then(r => {
      // ругаемся финальным статусом в консоль
      console.log('Закончили git clone');
      // console.log(settings);
      // запускаем последний коммит на билд
      // или если сделаем очрередь то ставим последний коммит в очередь
      return getLastCommit(settings);
    })
    .then(commitHash => {
      console.log('закончили getLastCommit:', commitHash);
      tmpCommitHash = commitHash;
      return getCommitInfo(commitHash, settings);
    })
    .then(commitInfo => {
      console.log('закончили getCommitInfo:', commitInfo);
      return yndx_db_api.post('/build/request', commitInfo);
    })
    .then(r => console.log(`Сборка для коммита ${tmpCommitHash} добавлена в очередь`))
    .catch(next);

  yndx_db_api
    .post('/conf', settings)

    .then(r => res.send('конфигурация сохранена'))
    .catch(next);

  // пытаемся найти репозиторий
});

router.delete('/', (req, res) => {
  yndx_db_api.delete('/conf').then(r => res.send('Конфигурация удалена.'));
});

module.exports = router;

// TODO: написать проверку, на клиенте конечно проверим, но и тут тоже
function isValidConfigarationSettings(settings) {
  return true;
}
