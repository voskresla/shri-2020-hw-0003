// TODO: добавить везде обработку статусов ответа yandex-api и обработку ошибок
// в целом

// TODO: возможно добваить протенький стейт для настроек чтобы отовсюду до него
// можно было достучаться

// TODO: добавить проверку на репозиторий при запуске билда из очереди. Вдруг
// репы то и нет еще или клон упал в процессе.

const express = require("express");

const path = require("path");
const yndx_db_api = require("./api/yndx_ci");
const { settingsRoutes, buildsRoutes } = require("./routes");
const { differenceInMilliseconds } = require("date-fns");
const cors = require("cors");
const PORT = 3001;

const log = `> shri-2020-task-1@1.0.0 build \n> webpack --mode=production \"--colors\"\n\nHash: \u001b[1me541e85eb5e88a853b17\u001b[39m\u001b[22m\nVersion: webpack \u001b[1m4.41.5\u001b[39m\u001b[22m\nTime: \u001b[1m1782\u001b[39m\u001b[22mms\nBuilt at: 2020-03-30 \u001b[1m0:39:32\u001b[39m\u001b[22m\n        \u001b[1mAsset\u001b[39m\u001b[22m      \u001b[1mSize\u001b[39m\u001b[22m  \u001b[1mChunks\u001b[39m\u001b[22m  \u001b[1m\u001b[39m\u001b[22m                 \u001b[1m\u001b[39m\u001b[22m\u001b[1mChunk Names\u001b[39m\u001b[22m\n    \u001b[1m\u001b[32mscript.js\u001b[39m\u001b[22m  1.83 KiB       \u001b[1m0\u001b[39m\u001b[22m  \u001b[1m\u001b[32m[emitted]\u001b[39m\u001b[22m        main\n\u001b[1m\u001b[32mscript.js.map\u001b[39m\u001b[22m  7.03 KiB       \u001b[1m0\u001b[39m\u001b[22m  \u001b[1m\u001b[32m[emitted] [dev]\u001b[39m\u001b[22m  main\n    \u001b[1m\u001b[32mstyle.css\u001b[39m\u001b[22m  20.5 KiB       \u001b[1m0\u001b[39m\u001b[22m  \u001b[1m\u001b[32m[emitted]\u001b[39m\u001b[22m        main\n\u001b[1m\u001b[32mstyle.css.map\u001b[39m\u001b[22m  24.8 KiB       \u001b[1m0\u001b[39m\u001b[22m  \u001b[1m\u001b[32m[emitted] [dev]\u001b[39m\u001b[22m  main\nEntrypoint \u001b[1mmain\u001b[39m\u001b[22m = \u001b[1m\u001b[32mstyle.css\u001b[39m\u001b[22m \u001b[1m\u001b[32mscript.js\u001b[39m\u001b[22m \u001b[1m\u001b[32mstyle.css.map\u001b[39m\u001b[22m \u001b[1m\u001b[32mscript.js.map\u001b[39m\u001b[22m\n[0] \u001b[1m./src/js/utils.js\u001b[39m\u001b[22m 514 bytes {\u001b[1m\u001b[33m0\u001b[39m\u001b[22m}\u001b[1m\u001b[32m [built]\u001b[39m\u001b[22m\n[1] \u001b[1mmulti ./src/js/_index.js ./src/scss/index.scss\u001b[39m\u001b[22m 40 bytes {\u001b[1m\u001b[33m0\u001b[39m\u001b[22m}\u001b[1m\u001b[32m [built]\u001b[39m\u001b[22m\n[2] \u001b[1m./src/js/_index.js\u001b[39m\u001b[22m 89 bytes {\u001b[1m\u001b[33m0\u001b[39m\u001b[22m}\u001b[1m\u001b[32m [built]\u001b[39m\u001b[22m\n[3] \u001b[1m./src/js/onoffswitch.js\u001b[39m\u001b[22m 654 bytes {\u001b[1m\u001b[33m0\u001b[39m\u001b[22m}\u001b[1m\u001b[32m [built]\u001b[39m\u001b[22m\n[4] \u001b[1m./src/js/e-accordion.js\u001b[39m\u001b[22m 403 bytes {\u001b[1m\u001b[33m0\u001b[39m\u001b[22m}\u001b[1m\u001b[32m [built]\u001b[39m\u001b[22m\n[5] \u001b[1m./src/scss/index.scss\u001b[39m\u001b[22m 39 bytes {\u001b[1m\u001b[33m0\u001b[39m\u001b[22m}\u001b[1m\u001b[32m [built]\u001b[39m\u001b[22m\n    + 1 hidden module\nChild \u001b[1mmini-css-extract-plugin node_modules/css-loader/dist/cjs.js??ref--5-1!node_modules/postcss-loader/src/index.js!node_modules/sass-loader/dist/cjs.js!src/scss/index.scss\u001b[39m\u001b[22m:\n    Entrypoint \u001b[1mmini-css-extract-plugin\u001b[39m\u001b[22m = \u001b[1m\u001b[32m*\u001b[39m\u001b[22m\n    [0] \u001b[1m./node_modules/css-loader/dist/cjs.js??ref--5-1!./node_modules/postcss-loader/src!./node_modules/sass-loader/dist/cjs.js!./src/scss/index.scss\u001b[39m\u001b[22m 20.7 KiB {\u001b[1m\u001b[33m0\u001b[39m\u001b[22m}\u001b[1m\u001b[32m [built]\u001b[39m\u001b[22m\n        + 1 hidden module\n`;

const app = express();

app.use(cors());
app.set("json spaces", 1);

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/settings", settingsRoutes);
app.use("/api/builds", buildsRoutes);

// NOTE: You define error-handling middleware last, after other app.use() and routes calls; for example:
// app.use(errorHandler);

// NOTE: а где появиться cancel build ?
// Пока что без настоящей очереди. Забирает последние 25 тупо каждый раз и берет
// первый Waiting оттуда. Отправляет его на build.

const queue = require("./util/queue");

// Пока проверяем только первые 100
// TODO: придумать как красиво решить вопрос бхода всего листа, вдруг где-то
// затисались Waitnig билды.
// const tmpTimer = setInterval(() => {
//   // console.log("Проверяем build/list");
//   yndx_db_api.get("/build/list", { params: { limit: 100 } }).then(buildList => {
//     const builds = buildList.data.data.filter(
//       build => build.status === "Waiting"
//     );
//     // console.log(builds);
//     builds.forEach(build => {
//       const buildId = build.id;

//       const dateTime = new Date();

//       const jobFn = function () {
//         let duration = undefined;
//         let success = undefined;
//         return yndx_db_api
//           .post("/build/start", { buildId, dateTime })
//           .then(async r => {
//             await new Promise(r =>
//               setTimeout(
//                 r,
//                 Math.floor(Math.random() * (5000 - 2000 + 1) + 2000)
//               )
//             );
//             duration = differenceInMilliseconds(new Date(), dateTime);
//             success = Boolean(Math.floor(Math.random() * Math.floor(2)));
//             const buildLog = log;

//             return yndx_db_api.post("/build/finish", {
//               buildId,
//               duration,
//               success,
//               buildLog
//             });
//           })
//           .then(r => {
//             return Promise.resolve({ name: buildId, duration, success });
//           })
//           .catch(err => {
//             console.log(err);
//           });
//       };

//       queue.add({
//         name: buildId,
//         fn: jobFn
//       });
//     });
//   });
// }, 10000);

app.listen(PORT, () => console.log("Server listening at port: ", PORT));
