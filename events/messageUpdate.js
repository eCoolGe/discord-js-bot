const {Events, AuditLogEvent, EmbedBuilder} = require('discord.js');
const {guilds} = require('../config.json')

module.exports = {
    name: Events.MessageUpdate,
    async execute(message, newMessage) {

        if (!message.guild || message.author.bot) return;

        guilds.map(guild => {
            const logChannel = message.guild.channels.cache.get(guild['logChannelId'])
            if (guild['id'] === message.guildId && logChannel) {

                const updMessageEmbed = new EmbedBuilder()
                    .setColor('#ea7777')
                    .setTitle('Сообщение было изменено')
                    .setAuthor({ name: message.author.tag, iconURL: message.author.avatarURL() })
                    .addFields({ name: 'Канал', value: `${message.channel}`, inline: false },
                        { name: 'Старое сообщение', value: `${message.content}`, inline: false },
                        { name: 'Новое сообщение', value: `${newMessage.content}`, inline: false },
                        { name: 'Дата создания', value: `<t:` + `${Math.floor(message.createdTimestamp/1000)}` + `:R>`, inline: false },
                        { name: 'Дата изменения', value: `<t:` + `${Math.floor(newMessage.editedTimestamp/1000)}` + `:R>`, inline: false },
                        { name: 'Автор', value: `${message.author}`, inline: false },
                    )
                    .setTimestamp()
                    .setFooter({ text: message.client.user.tag, iconURL: message.client.user.avatarURL() });

                logChannel.send({ embeds: [updMessageEmbed] });
            }
        })
    },
};