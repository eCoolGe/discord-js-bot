const { REST, Routes } = require('discord.js');
const { clientId, token } = require('../config.json');

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
    rest.put(Routes.applicationCommands(clientId), { body: [] })
        .then(() => console.log('Все команды (/) успешно удалены глобально'))
        .catch(console.error);
})();