
const { SlashCommandBuilder } = require('discord.js');
const { exerciseApiKey, exerciseApiHost } = require('../config.json');
const { muscles } = require('../muscles.json');


module.exports = {

    data: new SlashCommandBuilder()
        .setName('exercise')
        .setDescription('Replies with workout plan')
        .addStringOption(option =>
            option.setName('muscle')
                .setDescription('The muscle category')
                .setRequired(true)
                .addChoices(
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
                //const rand = Math.floor(Math.random()*muscles.length);
                //console.log(rand, muscles[rand]);
                // const rand = Math.floor(Math.random() * muscles.arms.length);
                // console.log(rand, muscles.arms[rand]);
                const url = `https://exercises-by-api-ninjas.p.rapidapi.com/v1/exercises?muscle=${muscle}`;
                const options = {
                    method: 'GET',
                    headers: {
                        'X-RapidAPI-Key': exerciseApiKey,
                        'X-RapidAPI-Host': exerciseApiHost
                    }
                };
                let exercisesArr = [];
                for (let i = 0; i < 3; i++) {
                    const response = await fetch(url, options);
                    const json = await response.json();
                    const index = Math.floor(Math.random() * json.length);
                    //let pay = json[index].stringify();

                    let pay = `Exercise: ${json[index].name}\nMuscle: ${json[index].muscle.toUpperCase()}\n
                    \n`;
                    console.log(pay);
                    exercisesArr.push(pay);
                }
                //let arrStr = exercisesArr.toString();
                let arrStr = exercisesArr.join('');
                console.log(arrStr);
                await interaction.reply(arrStr);
                //await interaction.reply(muscle);
            }
        }
        catch (error) {
            console.error(`Error executing ${interaction.commandName}`);
            console.error(error);
        }
    }
};

