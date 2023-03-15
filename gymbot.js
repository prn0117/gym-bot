const fs = require('node:fs');
const path = require('node:path');
const cron = require('cron');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const { token, clientId, guildId, channelId } = require('./config.json');

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

client.once(Events.ClientReady, () => {
    console.log('Ready!');
    let scheduledMessage = new cron.CronJob('00 11 18 * * *', () => {
        // This runs every day at 10:30:00, you can do anything you want
        // Specifing your guild (server) and your channel
        const channel = client.channels.cache.get(channelId);
        
        channel.send('content');
        //channel.send('You message');
    });

    // When you want to start it, use:
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