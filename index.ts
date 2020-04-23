
require('dotenv').config()
import express, { json } from 'express'
import { differenceInMilliseconds } from 'date-fns'
import cors from 'cors'

import { buildsRoutes, settingsRoutes } from './routes'
import { yndxDbApi } from './api/yndx_ci'
import { add } from './util/queue'

const PORT = 3001

const app = express()

app.use(cors())
app.set('json spaces', 1)

app.use(json())

app.use('/api/settings', settingsRoutes)
app.use('/api/builds', buildsRoutes)

// Пока проверяем только первые 100
// TODO: придумать как красиво решить вопрос бхода всего листа, вдруг где-то
// затисались Waitnig билды.
const tmpTimer = setInterval(() => {
	// console.log("Проверяем build/list");
	yndxDbApi.get('/build/list', { params: { limit: 100 } }).then(buildList => {
		const builds = buildList.data.data.filter(
			build => build.status === 'Waiting',
		)
		// console.log(builds);
		builds.forEach(build => {
			const buildId = build.id

			const dateTime = new Date()

			const jobFn = function () {
				let duration = undefined
				let success = undefined
				return post('/build/start', { buildId, dateTime })
					.then(async r => {
						await new Promise(r =>
							setTimeout(
								r,
								Math.floor(Math.random() * (5000 - 2000 + 1) + 2000),
							),
						)
						duration = differenceInMilliseconds(new Date(), dateTime)
						success = Boolean(Math.floor(Math.random() * Math.floor(2)))
						const buildLog = 'sdsd'

						return yndxDbApi.post('/build/finish', {
							buildId,
							duration,
							success,
							buildLog,
						})
					})
					.then(r => {
						return Promise.resolve({ name: buildId, duration, success })
					})
					.catch(err => {
						console.log(err)
					})
			}

			add({
				name: buildId,
				fn: jobFn,
			})
		})
	})
}, 10000)

const server = app.listen(PORT, () => console.log('Server listening at port: ', PORT))

export default server
