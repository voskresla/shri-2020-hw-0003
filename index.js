// TODO: добавить везде обработку статусов ответа yandex-api и обработку ошибок
// в целом

// TODO: возможно добваить протенький стейт для настроек чтобы отовсюду до него
// можно было достучаться

// TODO: как кэшировать логи? Создаем карту логов. Будет объект с информацией по
// билду. Первый раз выкачивая лог - добавим в этот объект его. При каждой
// запрос лога будем сначала смотреть в этот объект. А при каждом билде/ребилде
// брать хэш от лога и обновлять объект кэшей.

// TODO: увы, свою очередь придется-таки написать. Должна уметь, внезапно,
// очередь. (важно понят что процесс запуска идет не по таймеру а в методе
// очереиди add). Хорошо если будет уметь в таймаут (выбери это таймаут для
// конкретной задачи или от времени добавления тоже)

const express = require('express');

const path = require('path');
const { spawn } = require('child_process');
const yndx_db_api = require('./api/yndx_ci');
const { settingsRoutes, buildsRoutes } = require('./routes');
const { differenceInSeconds, differenceInMilliseconds } = require('date-fns');
const errorHandler = require('./middleware/createError');
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
// TODO: перенести в utils/build-agent
// const buildAgent = setInterval(() => {
//   console.log('run build-agent');
//   let buildId = null;
//   let dateTime = null;

//   // стучимся в yndx -> build/list
//   yndx_db_api
//     .get('/build/list')
//     .then(buildList => {
//       // берем пока первый с конца build со статусом waiting
//       // TODO: переделать так чтобы забирать первый из очереди, а не последний
//       // TODO: Не забывай что по дефолту там offset=0 и limit 25
//       // NOTE: для выставления статуса билда что принимаем за fail ? Только
//       // айди билда? А если какой-то из endpoint недоступен?
//       const build = buildList.data.data.filter(build => build.status === 'Waiting')[0];
//       // console.log(build);
//       if (!build) {
//         return Promise.reject('Нет больше билдов в очереди');
//       }
//       buildId = build.id;
//       dateTime = new Date();
//       console.log(`взяли в работу ${buildId}`);

//       return yndx_db_api.post('/build/start', { buildId, dateTime });
//     })
//     .then(async r => {
//       await new Promise(r => setTimeout(r, 2000));
//       const duration = differenceInMilliseconds(new Date(), dateTime);
//       const success = Boolean(Math.floor(Math.random() * Math.floor(2)));
//       const buildLog = 'my build log string';
//       console.log(
//         `закончили сборку для: ${buildId}, время сборки: ${duration}, статус: ${success}`,
//       );

//       return yndx_db_api.post('/build/finish', { buildId, duration, success, buildLog });
//     })
//     .catch(err => {
//       console.log(err);
//       // надо решить что делаем? отменяем весь билд? ставим ему canceled ?
//     });
// }, 5000);

// BUILD AGENT ROUTES

// route -> /build/start
// route -> /build/finish
// route -> /build/cancel

// Пробуем новую очередь

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
            // console.log(
            //   `закончили сборку для: ${buildId}, время сборки: ${duration}, статус: ${success}`,
            // );

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
