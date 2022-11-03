const { SlashCommandBuilder, ActivityType, PermissionFlagsBits} = require('discord.js');
const {setTimeout: wait} = require("node:timers/promises");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('activity')
        .setDescription('Изменить название/тип активности бота')
        .addStringOption(option =>
            option.setName('description')
                .setDescription('Текст активности')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('type')
                .setDescription('Тип активности')
                .setRequired(false)
                .addChoices(
                    { name: 'Смотрит', value: 'Watching' },
                    { name: 'Слушает', value: 'Listening' },
                    { name: 'Соревнуется в', value: 'Competing' },
                ))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDMPermission(false),
    async execute(interaction) {
        await interaction.deferReply();

        const bot = interaction.client.user
        const desc = interaction.options.getString('description')
        const type = interaction.options.getString('type')

        if (type) {
            let status = {
                'Watching': ActivityType.Watching,
                'Listening': ActivityType.Listening,
                'Competing': ActivityType.Competing
            };

            bot.setActivity(`${desc}`, { type: status[type] });
        } else {
            bot.setActivity(`${desc}`);
        }

        await interaction.editReply(`Тип/текст активности ${bot.tag} успешно изменен(-ы)`)
        await wait(5000)
        await interaction.deleteReply()
    },
};