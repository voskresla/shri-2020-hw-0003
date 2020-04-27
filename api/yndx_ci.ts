import https from 'https'

import axios from 'axios'

const TOKEN = process.env.MYAPIKEY

export const yndxApi = axios.create({
	baseURL: 'https://hw.shri.yandex/api/',
	headers: {
		Authorization: `Bearer ${TOKEN}`,
	},
	httpsAgent: new https.Agent({
		rejectUnauthorized: false,
	}),
})


