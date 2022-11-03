const { SlashCommandBuilder, ActivityType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Получите пинг бота в мс'),
    async execute(interaction) {
        const sent = await interaction.reply({ content: 'Определяем пинг...', fetchReply: true });
        await interaction.editReply(`Задержка составляет: ${sent.createdTimestamp - interaction.createdTimestamp}мс`);
    },
};