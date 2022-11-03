const {SlashCommandBuilder, EmbedBuilder} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription('Получите информацию о участнике или сервере')
        .addSubcommand(subcommand =>
            subcommand
                .setName('user')
                .setDescription('Информация о участнике')
                .addUserOption(option => option.setName('target').setDescription('Участник')))
        .addSubcommand(subcommand =>
            subcommand
                .setName('server')
                .setDescription('Информация о сервере'))
        .setDMPermission(false),
    async execute(interaction) {
        if (interaction.options.getSubcommand() === 'user') {
            await interaction.deferReply();
            const message = await interaction.fetchReply();

            const member = interaction.options.getMember('target') === null ? interaction.member : interaction.options.getMember('target');
            const user = interaction.options.getUser('target') === null ? interaction.user : interaction.options.getUser('target');
            let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
            let roles = member.roles.cache.sort((a, b) => b.position - a.position).map(r => r).join(" | ");
            if (roles.length > 1024) roles = "`У пользователя слишком много ролей, чтобы отобразить все здесь :с`";
            if (!roles) roles = "`У пользователя нет ролей :с`";
            let status = {
                true: 'Бот',
                false: 'Пользователь'
            };

            const userEmbed = new EmbedBuilder()
                .setColor('#ea7777')
                .setTitle('Информация о пользователе:')
                // .setDescription('Some description here')
                // .setURL('URL')
                .setAuthor({ name: `${user.tag}`, iconURL: `${user.displayAvatarURL()}` })
                .setThumbnail(user.displayAvatarURL())
                .addFields({ name: '\u200B', value: '\u200B' },
                    { name: '📛' + ' Имя', value: "`" + `${user.username}` + "`", inline: false },
                    { name: '🆔' + ' ID', value: "`" + `${user.id}` + "`", inline: false },
                    { name: '🕸️' + ' Тег', value: `<@${user.id}>`, inline: false },
                    { name: '✍' + ' Никнейм', value: "`" + `${member.nickname || "-"}` + "`", inline: false },
                    { name: '\u200B', value: '\u200B' },
                    { name: '🤖' + ' Сущность', value: "`" + `${status[user.bot]}` + "`", inline: true },
                    { name: '💾' + ' Аккаунт создан', value: `<t:` + `${Math.floor(user.createdTimestamp/1000)}` + `:R>`, inline: true },
                    { name: '🕳' + ' Присоединился', value: `<t:` + `${Math.floor(member.joinedTimestamp/1000)}` + `:R>`, inline: true },
                    { name: '💰' + ' Буст сервера', value: "`" + `${member.premiumSince?.toLocaleDateString("en-US", options) || "Не бустил"}` + "`", inline: true },
                    { name: '🔇' + ' Бездействие', value: "`" + `${member.communicationDisabledUntil?.toLocaleDateString("en-US", options) || "Никогда"}` + "`", inline: true },
                    { name: '🎧' + ' Голосовой канал', value: `${member.voice.channel || "`-`"}`, inline: true },
                    { name: '\u200B', value: '\u200B' },
                    { name: '👥'+' Список ролей', value: roles, inline: true },
                )
                // .setImage('URL')
                .setTimestamp()
                .setFooter({ text: message.author.tag, iconURL: message.author.avatarURL() });

            await interaction.editReply({ embeds: [userEmbed] });
        } else if (interaction.options.getSubcommand() === 'server') {
            await interaction.deferReply();
            const message = await interaction.fetchReply();
            const server = interaction.guild
            const roles = server.roles.cache.sort((a, b) => b.position - a.position).map(role => role.toString());
            const members = server.members.cache;
            const channels = server.channels.cache;
            const emojis = server.emojis.cache;
            // channels.map(chan => console.log(chan))
            // console.log(server)
            // members.map(chan => console.log(chan))

            const serverEmbed = new EmbedBuilder()
                .setColor('#ea7777')
                .setTitle('Информация о сервере:')
                // .setDescription('Some description here')
                // .setURL('URL')
                .setAuthor({ name: server.name, iconURL: server.iconURL({ dynamic: true }) })
                .setThumbnail(server.iconURL({ dynamic: true }))
                .addFields({ name: '\u200B', value: '\u200B' },
                    { name: '📛' + ' Название', value: "`" + `${server.name}` + "`", inline: false },
                    { name: '🆔' + ' ID', value: "`" + `${server.id}` + "`", inline: false },
                    { name: '🆔' + ' Владелец', value: `<@${server.ownerId}>`, inline: false },
                    { name: '\u200B', value: '\u200B' },
                    { name: '💾' + ' Cоздан', value: `<t:` + `${Math.floor(server.createdTimestamp/1000)}` + `:R>`, inline: true },
                    { name: '🆔' + ' Уровень буста', value: "`" + `${server.premiumTier}` + "`", inline: true },
                    { name: '🆔' + ' Кол-во бустов', value: "`" + `${server.premiumSubscriptionCount || '0'}` + "`", inline: true },
                    { name: '📛' + ' Emoji', value: "`" + `${emojis.size}` + "`", inline: true },
                    { name: '📛' + ' Обычные', value: "`" + `${emojis.filter(emoji => !emoji.animated).size}` + "`", inline: true },
                    { name: '📛' + ' Анимация', value: "`" + `${emojis.filter(emoji => emoji.animated).size}` + "`", inline: true },
                    { name: '📛' + ' Участников', value: "`" + `${server.memberCount}` + "`", inline: true },
                    { name: '📛' + ' Пользователей', value: "`" + `${members.filter(member => !member.user.bot).size + 1}` + "`", inline: true },
                    { name: '📛' + ' Ботов', value: "`" + `${members.filter(member => member.user.bot).size}` + "`", inline: true },
                    { name: '\u200B', value: '\u200B' },
                    { name: '📛' + ' Текстовых каналов', value: "`" + `${channels.filter(channel => channel.type === 0).size}` + "`", inline: true },
                    { name: '📛' + ' Голосовых каналов', value: "`" + `${channels.filter(channel => channel.type === 2).size}` + "`", inline: true },
                    { name: '\u200B', value: '\u200B' },
                    { name: '📛' + ' Канал бездействия', value: `${server.afkChannel}`, inline: true },
                    { name: '📛' + ' Время бездействия', value: "`" + `${Math.floor(server.afkTimeout/60)} минут` + "`", inline: true },
                    { name: '\u200B', value: '\u200B' },
                    { name: '📛' + ` Ролей — \`${roles.length - 1}\``, value: `${roles.join(' | ')}`, inline: true },
                )
                // .setImage('URL')
                .setTimestamp()
                .setFooter({ text: message.author.tag, iconURL: message.author.avatarURL() });
            await interaction.editReply({ embeds: [serverEmbed] });
        }
    },
};