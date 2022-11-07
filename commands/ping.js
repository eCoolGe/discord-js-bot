const { SlashCommandBuilder, ActivityType, PermissionFlagsBits} = require('discord.js');
const {setTimeout: wait} = require("node:timers/promises");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Получите пинг бота в мс')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
        .setDMPermission(false),
    async execute(interaction) {
        const sent = await interaction.reply({ content: '⏳' + ' Определяем пинг...', fetchReply: true });
        await interaction.editReply('⌛' + ` Задержка составляет: ${sent.createdTimestamp - interaction.createdTimestamp}мс`);
        await wait(5000)
        await interaction.deleteReply()
    },
};