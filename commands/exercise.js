
const { SlashCommandBuilder } = require('discord.js');
const { exerciseApiKey, exerciseApiHost } = require('../config.json');
const url = 'https://exercises-by-api-ninjas.p.rapidapi.com/v1/exercises?muscle=biceps';

module.exports = {

    data: new SlashCommandBuilder()
        .setName('exercise')
        .setDescription('Replies with workout plan'),
    async execute(interaction) {
        if (!interaction.isCommand()) return;

        try {
            if (interaction.commandName === 'exercise') {
                const options = {
                    method: 'GET',
                    headers: {
                        'X-RapidAPI-Key': exerciseApiKey,
                        'X-RapidAPI-Host': exerciseApiHost
                    }
                };

                const response = await fetch(url, options);
                const json = await response.json();
                const index = Math.floor(Math.random() * json.length);
                //let pay = json[index].stringify();
                let pay = `${json[index].name} for ${json[index].type}`;
                console.log(pay);
                await interaction.reply(pay);
            }
        }
        catch (error) {
            console.error(`Error executing ${interaction.commandName}`);
            console.error(error);
        }
    }
};

