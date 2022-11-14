# discord-js-bot `v.2.0.2`

### Команды запуска:

* `npm install` `npm i` - скачать и установить доступные зависимости
* `npm run start` - запуск бота
* Как отображать команды на серверах/в личных сообщениях:
  * `npm run upd-d` - обновить список доступных команд на **сервере разработки** бота
  * `npm run upd-g` - обновить список доступных команд **глобально** *(сервер разработки, личные сообщения боту, все сервера, где есть/может быть бот)*
  * `npm run upd-t` - обновить список доступых команд на **доверенных серверах** *(обновляет список команд на серверах, которые прописаны в `config.json`)*
  * `npm run del-g` - удалить все доступные команды **глобально**
  * `P.S.` Команды типа `upd-` автоматически удаляют недоступные команды и подгружают **только** доступные

___

### Пример `config.json`, необходимого для запуска бота:

```json
{
  "token": "<token>",
  "prefix": "!",
  "clientId": "<clientId>",
  "guildId": "<guildId>",
  "guilds": [
    {
      "id": "<id>",
      "name": "eCoolGe BotTestServer",
      "logChannelId": "<logChannelId>",
      "rainbowRolesId": []
    }
  ]
}
```

___

### Расшифровка `config.json`:

| Имя свойства     |                                  Описание                                  | Реализовано |
|------------------|:--------------------------------------------------------------------------:|------------:|
| `token`          |                             токен вашего бота                              |             |
| `prefix`         |                            префикс вашего бота                             |         нет |
| `clientId`       |                               id вашего бота                               |             |
| `guildId`        |                        id вашего тестового сервера                         |             |
| `guilds`         | массив серверов, необходимый для работы всех функций бота на этих серверах |             |
| `id`             |                                 id сервера                                 |             |
| `name`           |                                имя сервера                                 |             |
| `logChannelId`   |                       id канала логирования сервера                        |             |
| `rainbowRolesId` |                      id ролей с типом цвета "радуга"                       |         нет |





