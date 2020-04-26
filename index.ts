require('dotenv').config()

import path from 'path'

import express from 'express'
import cors from 'cors'

import { settingsRoutes, buildsRoutes } from './routes'
const PORT = 3001

const app = express()

app.use(cors())
app.set('json spaces', 1)

app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/api/settings', settingsRoutes)
app.use('/api/builds', buildsRoutes)

const server = app.listen(PORT, () => console.log('Server listening at port: ', PORT))

module.exports = server
