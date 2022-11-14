const {Events, AuditLogEvent, EmbedBuilder} = require('discord.js');
const {guilds} = require('../config.json')

module.exports = {
    name: Events.MessageDelete,
    async execute(message) {
        guilds.map(async guild => {
            const logChannel = message.guild.channels.cache.get(guild['logChannelId'])
            if (guild['id'] === message.guildId && logChannel) {
                if (!message.guild || message.author.bot) return;
                const fetchedLogs = await message.guild.fetchAuditLogs({
                    limit: 1,
                    type: AuditLogEvent.MessageDelete,
                });
                const deletionLog = fetchedLogs.entries.first();
                if (!deletionLog) return console.log(`Сообщение ${message.author.tag} было удалено, но релевантные логи не были обнаружены.`);
                const {executor, target} = deletionLog;

                const findExecutor = target.id === message.author.id ? `${executor}` : `${message.author}**/**\`Неизвестный\``

                const delMessageEmbed = new EmbedBuilder()
                .setColor('#ea7777')
                .setDescription(`${findExecutor} **удалил сообщение** ${message.author}`)
                .setAuthor({ name: message.author.tag, iconURL: message.author.avatarURL() })
                .addFields({ name: 'Канал', value: `${message.channel}`, inline: false },
                    { name: 'Контент', value: `${message.content}`, inline: false },
                    { name: 'Удалено', value: `<t:` + `${Math.floor(message.createdTimestamp/1000)}` + `:R>`, inline: false },
                )
                .setTimestamp()
                .setFooter({ text: message.client.user.tag, iconURL: message.client.user.avatarURL() });

                logChannel.send({embeds: [delMessageEmbed]});
            }
        })
    },
};