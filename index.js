const mineflayer = require('mineflayer');
const fs = require('fs');
const express = require('express');

// 1. FREE WEB SERVER WORKAROUND
const app = express();
const port = process.env.PORT || 3000;
app.get('/', (req, res) => res.send('Bot is awake!'));
app.listen(port, () => console.log(`Web server listening on port ${port}`));

// 2. MINECRAFT AFK BOT ENGINE
const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

function createBot() {
    const bot = mineflayer.createBot({
        host: config.serverHost,
        port: parseInt(config.serverPort),
        username: config.botUsername,
        version: false
    });

    bot.on('spawn', () => {
        console.log(`${bot.username} successfully connected to the server!`);
        setInterval(() => {
            bot.setControlState('jump', true);
            setTimeout(() => bot.setControlState('jump', false), 500);
        }, 15000);
    });

    bot.on('end', (reason) => {
        console.log(`Disconnected: ${reason}. Reconnecting in 10 seconds...`);
        setTimeout(createBot, 10000);
    });

    bot.on('error', (err) => {
        console.log(`Error encountered: ${err.message}`);
    });
}

createBot();
