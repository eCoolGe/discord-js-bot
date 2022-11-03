const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Получите пинг бота в мс'),
    async execute(interaction) {
        await interaction.reply('Pong!');
        // const message = await interaction.fetchReply();
        // console.log(message);
    },
};