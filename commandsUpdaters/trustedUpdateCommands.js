const { REST, Routes } = require('discord.js');
const { clientId, guilds, token } = require('../config.json');
const fs = require('node:fs');

const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`../commands/${file}`);
    commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
    try {
        console.log(`Обновление ${commands.length} команд (/) для доверенных серверов...`);
        guilds.map(async guild => {
            if (!guild['id']) return console.log(`Ошибка! Идентификатор гильдии ${guild['name']} не был обнаружен`)
            const data = await rest.put(
                Routes.applicationGuildCommands(clientId, guild['id']),
                { body: commands },
            );
            console.log(`Успешно обновлены ${data.length} команд (/) для сервера "${guild['name']}"`);
        })
    } catch (error) {
        console.error(error);
    }
})();