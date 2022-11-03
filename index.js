const fs = require('node:fs');
const path = require('node:path');
const {Client, Events, GatewayIntentBits, Collection, AuditLogEvent} = require('discord.js');
const {token, prefix} = require('./config.json');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ]
});

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
    } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

// client.on(Events.MessageCreate, async message => {
//     // Ignore direct messages
//     if (!message.guild) return;
//     console.log(message)
// });

// Часть обработчика команд через префикс
// client.on(Events.MessageCreate, async message => {
//     // console.log(message)
//     if (!message.content.startsWith(prefix) || message.author.bot) return;
//     // console.log(client.commands)
//     let messageArray = message.content.split(' ') // разделение пробелами
//     let command = messageArray[0] // команда после префикса
//     let args = messageArray.slice(1) // аргументы после команды
//
//     let command_file = client.commands.get(command.slice(prefix.length)) // получение команды из коллекции
//     // if (command_file) command_file.run(client, message, args, prefix)
//     if (command_file) console.log(command_file)
//     if (command_file) command_file.execute()
// })

client.login(token);

// exports.client = client
