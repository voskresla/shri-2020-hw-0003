const fs = require('fs');
const path = require('path');

// Простой логгер состояний репозитория {'repoName:status'}
// - clone-start
// - clone-success
// - clone-fail
// - pull-start
// - pull-success
class MyLogger {
  put(repository, status) {
    fs.readFile(path.join(process.cwd(), 'logs', 'repos.json'), (error, content) => {
      if (error) {
        console.log('error in mylogger put:readfile');
      }

      const log = JSON.parse(content);
      log[repository] = status;

      fs.writeFile(path.join(process.cwd(), 'logs', 'repos.json'), JSON.stringify(log), error => {
        if (error) console.log('error in mylogger put:writefile');
      });
    });
  }

  check(repository) {
    console.log('try to check');
  }
}

module.exports = new MyLogger();
