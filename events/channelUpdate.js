const {Events, AuditLogEvent, EmbedBuilder} = require('discord.js');
const {guilds} = require('../config.json')

const nsfwOptions = {
    true : "Да",
    false : "Нет"
}

const rateLimitOptions = {
    0: "Нет",
    5: "5 секунд",
    10: "10 секунд",
    15: "15 секунд",
    30: "30 секунд",
    60: "1 минута",
    120: "2 минуты",
    300: "5 минут",
    600: "10 минут",
    900: "15 минут",
    3600: "1 час",
    7200: "2 часа",
    21600: "6 часов"
}

module.exports = {
    name: Events.ChannelUpdate,
    async execute(channel) {
        guilds.map(async guild => {
            const logChannel = channel.guild.channels.cache.get(guild['logChannelId'])
            if (guild['id'] === channel.guildId && logChannel) {

                const fetchedLogs = await channel.guild.fetchAuditLogs({
                    limit: 1,
                    // type: AuditLogEvent.ChannelUpdate,
                });
                const channelUpdateLog = fetchedLogs.entries.first();

                if (channelUpdateLog.target.id === channel.id) {
                    console.log(channelUpdateLog.target.permissionOverwrites.cache)
                    let changes = []
                    channelUpdateLog.changes.map(change => console.log(change.key + ' ' + change.old + ' ' + change.new))
                    channelUpdateLog.changes.map(change => {
                        if (change.key === 'name') {
                              changes.push({name: 'Название канала', value: `\`${change.old}\` **→** \`${change.new}\``, inline: false})
                        }
                        if (change.key === 'topic') {
                            changes.push({name: 'Тема канала', value: `\`${!change.old ? '*пусто*' : change.old}\` \n**↓**\n \`${!change.new ? '*пусто*' : change.new}\``, inline: false})
                        }
                        if (change.key === 'rate_limit_per_user') {
                            changes.push({name: 'Медленный режим', value: `\`${rateLimitOptions[change.old]}\` **→** \`${rateLimitOptions[change.new]}\``, inline: false})
                        }
                        if (change.key === 'nsfw') {
                            changes.push({name: 'Канал с возрастным ограничением', value: `\`${nsfwOptions[change.old]}\` **→** \`${nsfwOptions[change.new]}\``, inline: false})
                        }
                        if (change.key === 'default_auto_archive_duration') {
                            changes.push({name: 'Скрыть после неактивности', value: `\`${change.old}\` **→** \`${change.new}\``, inline: false})
                        }
                        if (change.key === 'id' && !change.old) {
                            changes.push({name: 'Добавлены права для роли', value: `${channel.guild.roles.cache.get(change.new)}`, inline: false})
                        }
                        if (change.key === 'id' && !change.new) {
                            changes.push({name: 'Удалены права для роли', value: `${channel.guild.roles.cache.get(change.old)}`, inline: false})
                        }
                        if (change.key === 'allow' && change.old && change.new) {
                            changes.push({name: 'Изменены права для роли', value: `${channelUpdateLog.extra}`, inline: false})
                        }
                    })

                    const updChannelEmbed = new EmbedBuilder()
                        .setColor('#ea7777')
                        .setDescription(`${channelUpdateLog.executor} **изменил канал** ${channelUpdateLog.target}`)
                        .setAuthor({ name: channel.guild.name, iconURL: channel.guild.iconURL({ dynamic: true }) })
                        .addFields(changes)
                        .setTimestamp()
                        .setFooter({ text: channel.client.user.tag, iconURL: channel.client.user.avatarURL() });

                    logChannel.send({ embeds: [updChannelEmbed] });

                }
            }
        })
    },
};
