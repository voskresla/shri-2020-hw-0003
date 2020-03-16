// TODO: добавить везде обработку статусов ответа yandex-api и обработку ошибок
// в целом

// TODO: возможно добваить протенький стейт для настроек чтобы отовсюду до него
// можно было достучаться

// TODO: добавить проверку на репозиторий при запуске билда из очереди. Вдруг
// репы то и нет еще или клон упал в процессе.

const express = require('express');

const path = require('path');
const yndx_db_api = require('./api/yndx_ci');
const { settingsRoutes, buildsRoutes } = require('./routes');
const { differenceInMilliseconds } = require('date-fns');
const PORT = 3000;

const app = express();

app.set('json spaces', 1);

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/settings', settingsRoutes);
app.use('/api/builds', buildsRoutes);

// NOTE: You define error-handling middleware last, after other app.use() and routes calls; for example:
// app.use(errorHandler);

// NOTE: а где появиться cancel build ?
// Пока что без настоящей очереди. Забирает последние 25 тупо каждый раз и берет
// первый Waiting оттуда. Отправляет его на build.

const queue = require('./util/queue');

// Пока проверяем только первые 100
// TODO: придумать как красиво решить вопрос бхода всего листа, вдруг где-то
// затисались Waitnig билды.
const tmpTimer = setInterval(() => {
  console.log('Проверяем build/list');
  yndx_db_api.get('/build/list', { params: { limit: 100 } }).then(buildList => {
    const builds = buildList.data.data.filter(build => build.status === 'Waiting');
    // console.log(builds);
    builds.forEach(build => {
      const buildId = build.id;

      const dateTime = new Date();

      const jobFn = function() {
        let duration = undefined;
        let success = undefined;
        return yndx_db_api
          .post('/build/start', { buildId, dateTime })
          .then(async r => {
            await new Promise(r => setTimeout(r, 2000));
            duration = differenceInMilliseconds(new Date(), dateTime);
            success = Boolean(Math.floor(Math.random() * Math.floor(2)));
            const buildLog = 'my build log string';

            return yndx_db_api.post('/build/finish', { buildId, duration, success, buildLog });
          })
          .then(r => {
            return Promise.resolve({ name: buildId, duration, success });
          })
          .catch(err => {
            console.log(err);
          });
      };

      queue.add({
        name: buildId,
        fn: jobFn,
      });
    });
  });
}, 10000);

app.listen(PORT, () => console.log('Server listening at port: ', PORT));
