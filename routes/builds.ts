import express from 'express'
import { AxiosResponse } from 'axios'

import { yndxDbApi } from '../api/yndx_ci'
import { getCommitInfo } from '../child_process'

import { SettingsResponse } from './routes'

const router = express.Router()

// GET /api/builds
router.get('/', (req, res, next) => {
	console.log('GET builds')

	const { offset, limit } = req.query
	const params = {
		offset: offset ? offset : undefined,
		limit: limit ? limit : undefined,
	}

	yndxDbApi
		.get('/build/list', { params })
		.then(r => {
			res.send(r.data.data)
		})
		.catch(next)
})



// POST /api/builds/:commitHash
// добавление сборки в очередь
router.post('/:commitHash', (req, res) => {
	const commitHash = req.params.commitHash
	console.log(`POST :commithash ${commitHash}`)

	// TODO: вынести в отдельный метод для yndx_api
	yndxDbApi
		.get<{}, AxiosResponse<SettingsResponse>>('/conf')
		.then((settings) => getCommitInfo(commitHash, settings.data.data))
		.then(commitInfo => yndxDbApi.post('/build/request', commitInfo))
		.then(r => {
			console.log(`Сборка для коммита ${commitHash} добавлена в очередь`)
			res.json(r.data)
		})
		.catch(e => {
			// console.log(e)
			console.log(`Не смогли поставить сборку в очередь по коммиту #${commitHash}`)
			res.statusMessage = 'ERROR'
			return res.status(200).send({ message: 'Ошибка. Возможно такого коммита нет?' })
		})
})

// GET /api/builds/:buildNumber
// 1d06e279-6698-47b1-bcb7-9d4e688c9b20
// 13e9d499-afae-4a7a-8242-67fa6d41b8ce
router.get('/:buildNumber', async (req, res) => {
	console.log(`GET build #${req.params.buildNumber} details`)
	const buildNumber = Number(req.params.buildNumber)
	const limit = 25
	let offset = 0
	let stopCheck = false
	while (!stopCheck) {
		const params = {
			offset: offset ? offset : undefined,
			limit: limit ? limit : undefined,
		}
		const buildListChunk = await yndxDbApi.get('/build/list', { params })
		const buildInfo = buildListChunk.data.data.filter(e => e.buildNumber === buildNumber)

		if (buildInfo.length > 0) {
			stopCheck = true
			return res.send(buildInfo[0])
		}
		if (buildListChunk.data.data.length < limit) {
			stopCheck = true
			res.statusMessage = 'ERROR'
			console.log(`Не нашли сборку #${req.params.buildNumber}`)
			return res.status(200).send({ message: `Кажется Вы что-то делаете не так. Сборки под номером ${buildNumber} еще не существует.` })
		}
		offset += limit
	}
})

// GET /api/builds/:buildId/logs
router.get('/:buildId/logs', (req, res, next) => {
	const buildId = req.params.buildId
	console.log(`GET logs for #${buildId}`)

	yndxDbApi
		.get('/build/log', { params: { buildId } })
		.then(r => {
			if (r.data.length > 0) {
				return res.send(r.data)
			}
			res.statusMessage = 'ERROR'
			return res.status(200).send({ message: `Для сборки ${buildId} еще нет логов` })
		})
		.catch(next)
})

export const buildsRoutes = router
