const axios = require('axios');
const https = require('https');
const TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEwNDE2NjI4IiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZSI6InZvc2tyZXNsYSIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL2VtYWlsYWRkcmVzcyI6ImZpbHRoeS5hbmQuZmlsdGh5QGdtYWlsLmNvbSIsInVybjpnaXRodWI6bmFtZSI6IlN0ZXBhbiIsInVybjpnaXRodWI6dXJsIjoiaHR0cHM6Ly9hcGkuZ2l0aHViLmNvbS91c2Vycy92b3NrcmVzbGEiLCJuYmYiOjE1ODQwMzcxMDEsImV4cCI6MTU4NjYyOTEwMSwiaXNzIjoiU2hyaS1Ib21ld29yayIsImF1ZCI6IlNocmktSG9tZXdvcmsifQ.iS5r9FnVMi7-NeRQfsmCWSERRvLpMdRImwMqsQpQTYY';

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
