
const { SlashCommandBuilder } = require('discord.js');
const { giphyKey } = require('../config.json');
const url = `https://api.giphy.com/v1/gifs/search?api_key=${giphyKey}&q=dog&limit=25&offset=0&rating=g&lang=en`;
module.exports = {
    data: new SlashCommandBuilder()
        .setName('remind')
        .setDescription('Replies with GIF'),
    async execute(interaction) {
        if (!interaction.isCommand()) return;

        if (interaction.commandName === 'remind') {
            
            const url = `https://api.giphy.com/v1/gifs/search?api_key=${giphyKey}&q=dog&limit=25&offset=0&rating=g&lang=en`;
            const response = await fetch(url);
            const json = await response.json();
            const index = Math.floor(Math.random() * json.data.length);
            let payload = json.data[index].url;
            console.log(json.data[0].url);
            await interaction.reply(payload);
        }
    },
};