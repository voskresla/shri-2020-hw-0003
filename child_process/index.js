const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const yndx_db_api = require('../api/yndx_ci');
const myLogger = require('../logs/logger');

// TODO: пока считаем что мы всегда на мастере и комит который мы хотим
// запустить в билд точно есть в той ветке где мы находимся
exports.getCommitInfo = (commitHash, settings) => {
  const [username, repository] = settings.repoName.split('/');
  console.log('commitInfo - repository:', repository);
  console.log('commitInfo - hash:', commitHash);
  console.log('commitInfo - path:', path.join(process.cwd(), 'repos', repository));
  return new Promise((resolve, reject) => {
    const git = spawn('git', ['show', commitHash, '--pretty=format:"%h|%an|%s"', '--no-patch'], {
      cwd: path.join(process.cwd(), 'repos', repository),
    });

    git.stdout.on('data', data => {
      console.log('вошли в stdout.on.data');
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
      console.log('data stderr:', data.toString());
      reject(`Не смогли найти коммит: ${commitHash}`);
    });

    git.on('close', code => {});
  });
};

// Если репозитория или юзера нет то clone упадет с ошибкой - ее и вернем в
// статус в лог файл
exports.gitClone = ({ repoName, mainBranch }) => {
  return new Promise((resolve, reject) => {
    const [username, repository] = repoName.split('/');
    // проверяем есть ли уже такой репозиторий
    fs.access(path.join(process.cwd(), 'repos', repository), error => {
      if (!error) {
        // если есть такая папка - делаем гит пул
        // git -C <Path to directory> pull
        const pull = spawn('git', [
          '-C',

          path.join(process.cwd(), 'repos', repository).toString(),
          'pull',
          'origin',
          mainBranch,
        ]);

        // git.stdout.on('data', data => console.log('stdout:', data.toString()));
        // git.stderr.on('data', data => console.log('stderr:', data.toString()));

        // пока предположим что все что не exitcode:0  - ошибка
        pull.on('close', data => {
          if (data !== 0) {
            resolve(`не смогли сделать pull у репозитория ${repository}`);
            // TODO: пишем в лог статус репозитория - {status: fail, message:
            // pull - failed
            myLogger.put(repository, 'pull-failed');
          }
          console.log('git pull exit status:', data);
          resolve('pull - success');
          // TODO: пишем в лог статус репозитория - {status: success, message:
          // pull - succes
          myLogger.put(repoName, 'pull-success');
        });
      } else {
        // если такого репозитория нет в папке repos то пытаемся его скачать с
        // гитхаба
        console.log('начали попытку склонировать репозиторий');
        myLogger.put(repoName, 'clone-start');
        console.log('username:', username);
        console.log('reponame:', repository);
        const clone = spawn('git', [
          'clone',
          `https://github.com/${username}/${repository}.git`,
          path.join(process.cwd(), 'repos', repository),
        ]);

        clone.stdout.on('data', data => console.log('clone stdout:', data.toString()));
        clone.stderr.on('data', data => console.log('clone stderr:', data.toString()));
        clone.on('close', data => {
          console.log('clone exit code:', data);
          if (data == 0) {
            myLogger.put(repoName, 'clone-success');
            resolve('clone - success');
          }
          myLogger.put(repoName, 'clone-fail');

          reject();
        });
      }
    });
  });
};

exports.getLastCommit = settings => {
  const [username, repository] = settings.repoName.split('/');
  const repoPath = path.join(process.cwd(), 'repos', repository);
  console.log(repoPath);
  return new Promise((resolve, reject) => {
    const revParse = spawn('git', ['rev-parse', 'HEAD'], { cwd: repoPath });
    revParse.stdout.on('data', data => {
      const buffer = new Buffer.from(data).toString('utf8').split('\n');
      resolve(buffer[0]);
    });
    revParse.on('close', data => reject());
  });
};
