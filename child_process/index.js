const { spawn, exec } = require('child_process');
const fs = require('fs');
const path = require('path');
// const yndx_db_api = require('../api/yndx_ci');
const myLogger = require('../logs/logger');

// Собираем данные по коммиту. Вне зависмости от того какая ветка стоить в
// настрйкищем коммит через reflog и отдаем информацию по первому найденному
// - resolve c объектом данных
// - reject если не нашли коммита
exports.getCommitInfo = (commitHash, settings) => {
  console.log('in get commit info', settings);
  const [username, repository] = settings.repoName.split('/');
  return new Promise((resolve, reject) => {
    exec(
      `git reflog --format="%H|%an|%s|%D" | grep ${commitHash} -m 1`,
      {
        cwd: path.join(process.cwd(), 'repos', repository),
      },
      (error, stdout, stderr) => {
        if (error) {
          reject(`Не смогли найти коммит: ${commitHash}`);
        } else {
          const buffer = new Buffer.from(stdout).toString('utf8').split('|');

          // console.log(buffer);

          const commitMessage = buffer[2];
          const commitHash = buffer[0];
          const branchName = buffer[3];
          const authorName = buffer[1];

          // TODO: откуда берем branch? И какая тут логика: ищем по всем веткам /
          // только в ветке из настроек? тогда что значит "любой коммит можно
          // запустить на билд" ?
          const commitInfo = {
            commitMessage,
            commitHash,
            branchName,
            authorName,
          };

          resolve(commitInfo);
        }

        console.log('out:', stdout);
        console.log('error:', error);
        console.log('err:', stderr);
      },
    );
    // const git = spawn('git', ['reflog', `--format="%h|%an|%s|%D" | grep ${commitHash} -m 1`], {
    //   cwd: path.join(process.cwd(), 'repos', repository),
    // });

    // git.stdout.on('data', data => {
    //   const buffer = new Buffer.from(data).toString('utf8').split('|');

    //   // console.log(buffer);

    //   const commitMessage = buffer[2];
    //   const commitHash = buffer[0];
    //   const branchName = buffer[3];
    //   const authorName = buffer[1];

    //   // TODO: откуда берем branch? И какая тут логика: ищем по всем веткам /
    //   // только в ветке из настроек? тогда что значит "любой коммит можно
    //   // запустить на билд" ?
    //   const commitInfo = {
    //     commitMessage,
    //     commitHash,
    //     branchName,
    //     authorName,
    //   };

    //   resolve(commitInfo);
    // });

    // git.stderr.on('data', data => {
    //   console.log('data stderr:', data.toString());
    //   reject(`Не смогли найти коммит: ${commitHash}`);
    // });

    // git.on('close', code => {});
  });
};

// gitClone сейчас выполняет функции:
// - проверяет есть ли такой репозиторий уже в папке ./repos
// - если нет пытается склонировать с github
// - если есть то сделает git pull

// gitClone выйдет с reject, если:
// - нет такого репозитория на github или упал clone
// - если упал pull

// gitClone выйдет с resolve, если:
// - удачно склонировали репозиторий
// - удачно прошел pull
exports.gitClone = ({ repoName, mainBranch }) => {
  return new Promise((resolve, reject) => {
    const [username, repository] = repoName.split('/');
    // проверяем есть ли уже такой репозиторий
    fs.access(path.join(process.cwd(), 'repos', repository), error => {
      // если такого репозитория нет в папке repos то пытаемся его скачать с
      // гитхаба
      if (error) {
        myLogger.put(repoName, 'clone-start');

        const clone = spawn('git', [
          'clone',
          `https://github.com/${username}/${repository}.git`,
          path.join(process.cwd(), 'repos', repository),
        ]);

        clone.on('close', data => {
          if (data == 0) {
            myLogger.put(repoName, 'clone-success');
            resolve('clone-success');
          }

          myLogger.put(repoName, 'clone-fail');
          reject('clone-fail');
        });
      }
      // если есть такая папка - делаем гит пул
      // git -C <Path to directory> pull
      else {
        myLogger.put(repoName, 'pull-start');

        const pull = spawn('git', [
          '-C',
          path.join(process.cwd(), 'repos', repository).toString(),
          'pull',
          'origin',
        ]);

        // пока предположим что все что не exit code:0 - ошибка
        pull.on('close', data => {
          if (data !== 0) {
            myLogger.put(repository, 'pull-failed');
            reject('pull - fail');
          }

          myLogger.put(repoName, 'pull-success');
          resolve('pull - success');
        });
      }
    });
  });
};

// Ищем и забираем послежний коммит из ветки mainBranch из репозитория из
// настроек
// - resolve c хэшем коммита
// - reject если ошибка в git rev-parse
exports.getLastCommit = settings => {
  const [username, repository] = settings.repoName.split('/');
  const repoPath = path.join(process.cwd(), 'repos', repository);

  return new Promise((resolve, reject) => {
    const revParse = spawn('git', ['rev-parse', 'HEAD'], { cwd: repoPath });
    revParse.stdout.on('data', data => {
      const buffer = new Buffer.from(data).toString('utf8').split('\n');
      resolve(buffer[0]);
    });
    revParse.on('close', data => reject('rev-parse - fail'));
  });
};
