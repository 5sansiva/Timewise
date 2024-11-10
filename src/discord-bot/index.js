// Name: Venkat Sai Eshwar Varma Sagi (VXS210103)

// Importing necessary modules from discord.js for bot functionality
import { Client, GatewayIntentBits } from 'discord.js';

// Importing node-fetch to make HTTP requests
import fetch from 'node-fetch';

// Import dotenv to load environment variables
import * as dotenv from 'dotenv';

// Import utilities for file path manipulation
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Retrieve the current filename and directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env.local file
dotenv.config({ path: join(__dirname, '../../.env.local') });

// Check if the bot token is set; exit if missing
if (!process.env.DISCORD_BOT_TOKEN) {
  console.error('Discord bot token is missing! Make sure DISCORD_BOT_TOKEN is set in your .env.local file.');
  process.exit(1);
}

// Initialize a new Discord client with the specified intents
const client = new Client({
  intents: [
    // Allows bot to interact with server guilds
    GatewayIntentBits.Guilds,
    // Enables access to messages in guilds
    GatewayIntentBits.GuildMessages,
    // Allows reading message content
    GatewayIntentBits.MessageContent
  ],
});

// Set the URL for the calendar API, with a fallback option
const CALENDAR_API_URL = process.env.CALENDAR_API_URL || 'http://localhost:3000/api/chat';

// Event listener for when the bot is ready
client.once('ready', () => {
  console.log('Discord Calendar Bot is ready!');
  console.log(`Logged in as ${client.user.tag}`);
});

// Event listener for handling new messages
client.on('messageCreate', async (message) => {
  // Ignore messages from other bots
  if (message.author.bot) return;
  
  // Check if the message starts with the calendar command prefix
  if (message.content.startsWith('!calendar')) {
    // Extract the command part after prefix
    const command = message.content.slice('!calendar'.length).trim(); 
    
    try {
      // Send the command to the Calendar API via a POST request
      const response = await fetch(CALENDAR_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Pass command in the request body
        body: JSON.stringify({ message: command }),
      });

      // If response is not successful, throw an error
      if (!response.ok) {
        throw new Error(`API response error: ${response.status}`);
      }

      // Parse the API response as JSON
      const data = await response.json();
      
      // Reply to the user in Discord with the response data
      await message.reply({
        content: data.response,
        // If there are events, format and display them as embedded fields
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

// Handle any client errors
client.on('error', (error) => {
  console.error('Discord client error:', error);
});

// Global error handling for unhandled promise rejections
process.on('unhandledRejection', (error) => {
  console.error('Unhandled promise rejection:', error);
});

// Log in the bot to Discord using the token
try {
  await client.login(process.env.DISCORD_BOT_TOKEN);
} catch (error) {
  console.error('Failed to log in to Discord:', error);
  // Exit if login fails
  process.exit(1);
}
