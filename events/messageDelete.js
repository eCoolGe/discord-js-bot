const {Events, AuditLogEvent, EmbedBuilder} = require('discord.js');
const {guilds} = require('../config.json')

module.exports = {
    name: Events.MessageDelete,
    async execute(message) {

        if (!message.guild || message.author.bot) return;
        const fetchedLogs = await message.guild.fetchAuditLogs({
            limit: 1,
            type: AuditLogEvent.MessageDelete,
        });
        const deletionLog = fetchedLogs.entries.first();

        if (!deletionLog) return console.log(`A message by ${message.author.tag} was deleted, but no relevant audit logs were found.`);

        const {executor, target} = deletionLog;

        guilds.map(guild => {
            const logChannel = message.guild.channels.cache.get(guild['logChannelId'])
            if (guild['id'] === message.guildId && logChannel) {
                const exe = target.id === message.author.id ? `<@${executor.id}>` : '\`-\`'

                const delMessageEmbed = new EmbedBuilder()
                    .setColor('#ea7777')
                    .setTitle('Сообщение было удалено')
                    .setAuthor({ name: message.author.tag, iconURL: message.author.avatarURL() })
                    .addFields({ name: 'Канал', value: `${message.channel}`, inline: false },
                        { name: 'Контент', value: `${message.content}`, inline: false },
                        { name: 'Дата удаления', value: `<t:` + `${Math.floor(message.createdTimestamp/1000)}` + `:R>`, inline: false },
                        { name: 'Автор', value: `${message.author}`, inline: false },
                        { name: 'Кто удалил', value: exe, inline: true },
                    )
                    .setTimestamp()
                    .setFooter({ text: message.client.user.tag, iconURL: message.client.user.avatarURL() });

                logChannel.send({ embeds: [delMessageEmbed] });
            }
        })
    },
};