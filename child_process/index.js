const { spawn } = require('child_process');
const yndx_db_api = require('../api/yndx_ci');
const path = require('path');

// TODO: пока считаем что мы всегда на мастере и комит который мы хотим
// запустить в билд точно есть в той ветке где мы находимся
exports.getCommitInfo = commitHash =>
  new Promise((resolve, reject) => {
    const git = spawn('git', ['show', commitHash, '--pretty=format:"%h|%an|%s"', '--no-patch'], {
      cwd: path.join(process.cwd(), 'repos/shri_2020_hw_0001'),
    });

    git.stdout.on('data', data => {
      const buffer = new Buffer.from(data).toString('utf8').split('|');

      // TODO: откуда берем branch? И какая тут логика: ищем по всем веткам /
      // только в ветке из настроек? тогда что значит "любой коммит можно
      // запустить на билд" ?
      const commitInfo = {
        commitMessage: buffer[2],
        commitHash: commitHash,
        branchName: 'master',
        authorName: buffer[1],
      };

      resolve(commitInfo);
    });

    git.stderr.on('data', data => {
      reject(`Не смогли найти коммит: ${commitHash}`);
    });

    git.on('close', code => {});
  });
