const fs = require('node:fs');
const path = require('node:path');
const cron = require('cron');
const { giphyKey } = require('./config.json');
const { exerciseApiKey, exerciseApiHost } = require('./config.json');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const { token, clientId, guildId, channelId } = require('./config.json');
const { muscles } = require('./muscles.json');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Ensure we can use commands from the command directory
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    client.commands.set(command.data.name, command);
}
let reminderTime = '00 49 12 * * *';
// At reminderTime, display message with call to GIPHY
client.once(Events.ClientReady, () => {
    console.log('Ready!');
    let scheduledMessage = new cron.CronJob(reminderTime, async () => {
        // This runs every day at reminderTime
        const url = `https://api.giphy.com/v1/gifs/search?api_key=${giphyKey}&q=dogs&limit=25&offset=0&rating=g&lang=en`;
        const response = await fetch(url);
        const json = await response.json();
        const index = Math.floor(Math.random() * json.data.length);
        let payload = json.data[index].url;
        const channel = client.channels.cache.get(channelId);
        channel.send(`This is your daily work-out call.`);
        channel.send(`${payload}`);
        channel.send('Type "/exercise" for a custom workout plan! Select your choice of muscle.');
    });

    scheduledMessage.start()
});
client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
        } else {
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }
});

client.login(token);