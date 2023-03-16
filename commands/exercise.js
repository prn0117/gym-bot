/*The bot replies with a custom exercise plan for the muscle group option selected, uses Exercises API */
const { SlashCommandBuilder } = require('discord.js');
const { exerciseApiKey, exerciseApiHost } = require('../config.json');
const { muscles } = require('../muscles.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('exercise')
        .setDescription('Replies with workout plan for muscle selected')
        .addStringOption(option =>
            option.setName('muscle')
                .setDescription('The muscle category')
                .setRequired(true)
                .addChoices(
                    // Options for user to select muscle group, randomized to give different exercises each time
                    { name: 'Arms', value: muscles.arms[Math.floor(Math.random() * muscles.arms.length)] },
                    { name: 'Upper', value: muscles.upper[Math.floor(Math.random() * muscles.upper.length)] },
                    { name: 'Legs', value: muscles.legs[Math.floor(Math.random() * muscles.legs.length)] },
                    { name: 'Back', value: muscles.back[Math.floor(Math.random() * muscles.back.length)] },
                    { name: 'Core', value: muscles.core[Math.floor(Math.random() * muscles.core.length)] },
                )),
    async execute(interaction) {
        if (!interaction.isCommand()) return;
        try {
            if (interaction.commandName === 'exercise') {

                const muscle = interaction.options.getString('muscle');
                const url = `https://exercises-by-api-ninjas.p.rapidapi.com/v1/exercises?muscle=${muscle}`;
                const options = {
                    method: 'GET',
                    headers: {
                        'X-RapidAPI-Key': exerciseApiKey,
                        'X-RapidAPI-Host': exerciseApiHost
                    }
                };
                let exercisesArr = [];
                // call API multiple times to get randomized exercises
                for (let i = 0; i < 3; i++) {
                    const response = await fetch(url, options);
                    const json = await response.json();
                    const index = Math.floor(Math.random() * json.length);
                    //Muscle: ${json[index].muscle}\n
                    let payload = `Exercise: ${json[index].name}\nType: ${json[index].type}\nEquipment: ${json[index].equipment}\nLevel: ${json[index].difficulty}\n\n`;
                    console.log(payload);
                    exercisesArr.push(payload);
                }
                
                let arrStr = exercisesArr.join('');
                console.log(arrStr);
                // send output to discord client
                await interaction.reply(arrStr);
            }
        }
        catch (error) {
            console.error(`Error executing ${interaction.commandName}`);
            console.error(error);
        }
    }
};

