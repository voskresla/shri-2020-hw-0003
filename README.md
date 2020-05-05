# Домашнее задание для Яндекс ШРИ-2020. CRA -> Service Workers


# README - описание

- Добавил поддержку Service Workers.

Попробовал два варианта. 

1. С помощью workbox (файл ./web/src/sw-template.js): 

- Убрал дефолтный, завел возможность добавлять кастомный sw при npm run build с помощью workbox-build утилиты. 
- Варианты с precached давали результаты зуже чем без него. Поскольку app shell не реализован, а размер ресурсов (js, css, svg) достаточно маленький, вкладка performance давала незначительные изменения показателей.
- Остановился на варианте когда html + svg в precached, а css + js в networkFirst

2. Без фреймворков:

- Возможность использования кастомного SW сделал через workbox build, потому что не понравилось ничего из: eject, rewind, просто класть свой воркер в public.
- Из прошлого опыта с precached вынес в install только html + svg.
- Остальные ресурсы сделал cache and update.
- Отдельно сделал кэширование логов, только если они получены (в моей реализация завязался на statusText от сервера). 

# До запуска

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

## Запустить клиент
```bash
cd web
npm run build && serve -s build
```

