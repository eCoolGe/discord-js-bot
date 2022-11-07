const {Events, AuditLogEvent, EmbedBuilder} = require('discord.js');
const {guilds} = require('../config.json')

module.exports = {
    name: Events.MessageDelete,
    async execute(message) {

        // Ignore direct and bot messages
        if (!message.guild || message.author.bot) return;
        const fetchedLogs = await message.guild.fetchAuditLogs({
            limit: 1,
            type: AuditLogEvent.MessageDelete,
        });
        // Since there's only 1 audit log entry in this collection, grab the first one
        const deletionLog = fetchedLogs.entries.first();

        // Perform a coherence check to make sure that there's *something*
        if (!deletionLog) return console.log(`A message by ${message.author.tag} was deleted, but no relevant audit logs were found.`);

        // Now grab the user object of the person who deleted the message
        // Also grab the target of this action to double-check things
        const {executor, target} = deletionLog;

        // Update the output with a bit more information
        // Also run a check to make sure that the log returned was for the same author's message
        guilds.map(guild => {
            if (guild['id'] === message.guildId) {
                const logChannel = message.guild.channels.cache.get(guild['logId'])
                const exe = target.id === message.author.id ? `<@${executor.id}>` : '\`-\`'
                // logChannel.send(`Сообщение ${message.author.tag} было удалено ${exe}`)

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
        // console.log(message)
        // console.log(message.client)
        //
        //
        // if (target.id === message.author.id) {
        //     console.log(`A message by ${message.author.tag} was deleted by ${executor.tag}.`);
        // } else {
        //     console.log(`A message by ${message.author.tag} was deleted, but we don't know by who.`);
        // }
    },
};