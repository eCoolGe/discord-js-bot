const {SlashCommandBuilder, PermissionFlagsBits} = require('discord.js');
const {setTimeout: wait} = require("node:timers/promises");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Удалите определённое количество сообщений')
        .addIntegerOption(option =>
            option
                .setName('count')
                .setDescription('Количество сообщений, которое необходимо удалить')
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(100))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
        .setDMPermission(false),
    async execute(interaction) {
        interaction.deferReply();

        const count = interaction.options.getInteger('count');

        await interaction.channel.messages.fetch({
            limit: count
        }).then(async messages => {
            interaction.channel.bulkDelete(messages)
                .then(async () => {
                    await interaction.editReply(`Удалено сообщений: ${count}`)
                    await wait(5000)
                    await interaction.deleteReply()


                })
                .catch(async () => {
                    await interaction.editReply('Вы не можете удалить сообщения позднее 14 дней отправки')
                    await wait(5000)
                    await interaction.deleteReply()
                })


        })

    },
};