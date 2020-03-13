const express = require('express');
const yndx_db_api = require('../api/yndx_ci');
const router = express.Router();

// GET /api/settings
router.get('/', (req, res) => {
  yndx_db_api.get('/conf').then(r => res.send(r.data));
});

// POST /api/settings
router.post('/', (req, res) => {
  if (!isValidConfigarationSettings(req.body)) {
    return res.send('Не валидные настройки');
  }

  const settings = req.body || {
    repoName: 'voskresla/shri_2020_hw_0001',
    buildCommand: 'npm run build',
    mainBranch: 'master',
    period: 0,
  };

  yndx_db_api.post('/conf', settings).then(r => res.send('конфигурация сохранена'));
});

module.exports = router;

// TODO: написать проверку, на клиенте конечно проверим, но и тут тоже
function isValidConfigarationSettings(settings) {
  return true;
}
