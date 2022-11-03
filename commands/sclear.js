const {SlashCommandBuilder, PermissionFlagsBits} = require('discord.js');
const {setTimeout: wait} = require("node:timers/promises");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sclear')
        .setDescription('Удалите определённое количество сообщений')
        .addIntegerOption(option =>
            option
                .setName('count')
                .setDescription('Количество сообщений, которое необходимо удалить')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDMPermission(false),
    async execute(interaction) {


        const count = interaction.options.getInteger('count');

        await interaction.channel.messages.fetch({
            limit: count
        }).then(async messages => {
            messages.forEach(msg => {
                msg.delete()
            })

        })
        await interaction.deferReply();
        await wait(3000)
        await interaction.editReply(`Удалено сообщений: ${count}`)
        await wait(5000)
        await interaction.deleteReply()


    },
};