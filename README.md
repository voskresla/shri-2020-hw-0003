# Домашнее задание для Яндекс ШРИ-2020. CRA -> Service Workers

- Init.

# Домашнее задание для Яндекс ШРИ-2020. CI server -> TS

- Сервер в корне. Клиентская часть в `./web`.

- Ключ от `https://hw.shri.yandex/api/` надо положить в `./.env`
```env
MYAPIKEY=%token%
```

## Перед запуском

```bash
nvm use 11.15.0
npm i 
cd web 
npm i 
cd ..
```

## Запустить сервер (из корня)
```bash
npm run server:watch
```

## Запустить клиент (из корня)
```bash
npm run start-cra
```

