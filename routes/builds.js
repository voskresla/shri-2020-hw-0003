const express = require('express');
const path = require('path');
const { spawn } = require('child_process');
const yndx_db_api = require('../api/yndx_ci');
const { getCommitInfo } = require('../child_process');
const router = express.Router();
const createError = require('http-errors');

// GET /api/builds
router.get('/', (req, res, next) => {
  yndx_db_api
    .get('/build/list')
    .then(r => {
      res.send(r.data.data);
    })
    .catch(err => next(createError(500, 'что-то пошло не так')));
});

// POST /api/builds/:commitHash
// добавление сборки в очередь
router.post('/:commitHash', (req, res) => {
  const commitHash = req.params.commitHash;
  // TODO: вынести в отдельный метод для yndx_api
  yndx_db_api
    .get('/conf')
    .then(settings => getCommitInfo(commitHash, JSON.parse(settings)))
    .then(commitInfo => yndx_db_api.post('/build/request', commitInfo))
    .then(r => res.send(`Сборка для коммита ${commitHash} добавлена в очередь`))
    .catch(err => res.send(err));
});

// GET /api/builds/:buildId
router.get('/:buildId', (req, res) => {
  const buildId = req.params.buildId;

  yndx_db_api.get('/build/list').then(r => {
    const buildInfo = r.data.data.filter(e => e.id === buildId);

    return buildInfo.length > 0 ? res.send(buildInfo) : res.send(`Не нашли build c id:${buildId}`);
  });
});

// GET /api/builds/:buildId/logs
router.get('/:buildId/logs', (req, res) => {
  const buildId = req.params.buildId;

  yndx_db_api.get('/build/log', { params: { buildId } }).then(r => {
    r.data.length > 0 ? res.send(r.data) : res.send(`Для build ${buildId} еще нет логов`);
  });
});

module.exports = router;
