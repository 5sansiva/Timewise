// src/discord-bot/index.js
import { Client, GatewayIntentBits } from 'discord.js';
import fetch from 'node-fetch';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '../../.env.local') });

// Verify token is loaded
if (!process.env.DISCORD_BOT_TOKEN) {
  console.error('Discord bot token is missing! Make sure DISCORD_BOT_TOKEN is set in your .env.local file.');
  process.exit(1);
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const CALENDAR_API_URL = process.env.CALENDAR_API_URL || 'http://localhost:3000/api/chat';

client.once('ready', () => {
  console.log('Discord Calendar Bot is ready!');
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  // Ignore messages from bots
  if (message.author.bot) return;
  
  // Check if message starts with the calendar command prefix
  if (message.content.startsWith('!calendar')) {
    const command = message.content.slice('!calendar'.length).trim();
    
    try {
      // Send the command to your calendar API
      const response = await fetch(CALENDAR_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: command }),
      });

      if (!response.ok) {
        throw new Error(`API response error: ${response.status}`);
      }

      const data = await response.json();
      
      // Send the response back to Discord
      await message.reply({
        content: data.response,
        // If there are events in the response, format them nicely
        embeds: data.events ? [{
          title: 'Calendar Events',
          fields: data.events.map(event => ({
            name: event.title,
            value: `Start: ${new Date(event.start).toLocaleString()}\nEnd: ${new Date(event.end).toLocaleString()}`,
            inline: true
          }))
        }] : []
      });
    } catch (error) {
      console.error('Error processing calendar command:', error);
      await message.reply('Sorry, there was an error processing your calendar command.');
    }
  }
});

// Error handling
client.on('error', (error) => {
  console.error('Discord client error:', error);
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled promise rejection:', error);
});

// Start the bot
try {
  await client.login(process.env.DISCORD_BOT_TOKEN);
} catch (error) {
  console.error('Failed to log in to Discord:', error);
  process.exit(1);
}