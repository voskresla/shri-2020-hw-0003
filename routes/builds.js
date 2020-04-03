const express = require("express");
const path = require("path");
const { spawn } = require("child_process");
const yndx_db_api = require("../api/yndx_ci");
const { getCommitInfo } = require("../child_process");
const router = express.Router();
const createError = require("http-errors");
// const myLogger = require('../logs/logger');

// GET /api/builds
router.get("/", (req, res, next) => {
  console.log("GET builds");
  const { offset, limit } = req.query;

  const params = {
    offset: !!offset ? offset : undefined,
    limit: !!limit ? limit : undefined
  };

  yndx_db_api
    .get("/build/list", { params })
    .then(r => {
      res.send(r.data.data);
    })
    .catch(next);
});

// POST /api/builds/:commitHash
// добавление сборки в очередь
router.post("/:commitHash", (req, res, next) => {
  console.log("POST :commithash");
  const commitHash = req.params.commitHash;

  // TODO: вынести в отдельный метод для yndx_api
  yndx_db_api
    .get("/conf")
    .then(settings => getCommitInfo(commitHash, settings.data.data))
    .then(commitInfo => yndx_db_api.post("/build/request", commitInfo))
    .then(r => {
      console.log(`Сборка для коммита ${commitHash} добавлена в очередь`);
      res.json(r.data);
    })
    .catch(next);
});

// GET /api/builds/:buildId
// 1d06e279-6698-47b1-bcb7-9d4e688c9b20
// 13e9d499-afae-4a7a-8242-67fa6d41b8ce
router.get("/:buildId", async (req, res) => {
  const buildId = req.params.buildId;
  let limit = 25;
  let offset = 0;
  let stopCheck = false;
  while (!stopCheck) {
    const params = {
      offset: !!offset ? offset : undefined,
      limit: !!limit ? limit : undefined
    };

    const buildListChunk = await yndx_db_api.get("/build/list", { params });

    const buildInfo = buildListChunk.data.data.filter(e => e.id === buildId);

    if (buildInfo.length > 0) {
      stopCheck = true;
      return res.send(buildInfo);
    }
    if (buildListChunk.data.data.length < limit) {
      stopCheck = true;
      return res.send(`Для build ${buildId} еще нет логов`);
    }
    offset += limit;
  }
});

// GET /api/builds/:buildId/logs
router.get("/:buildId/logs", (req, res, next) => {
  const buildId = req.params.buildId;

  yndx_db_api
    .get("/build/log", { params: { buildId } })
    .then(r => {
      r.data.length > 0
        ? res.send(r.data)
        : res.send(`Для build ${buildId} еще нет логов`);
    })
    .catch(next);
});

module.exports = router;
