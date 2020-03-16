const axios = require('axios');
const https = require('https');

const TOKEN = process.env.MYAPIKEY;

const yndx_db_api = axios.create({
  baseURL: 'https://hw.shri.yandex/api/',
  headers: {
    Authorization: `Bearer ${TOKEN}`,
  },
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
  }),
});

module.exports = yndx_db_api;
