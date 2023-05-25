import Discord from "discord.js";

import {Telegraf} from "telegraf";

// Создание экземпляров ботов
const telegramBot = new Telegraf('6141825269:AAGJShhgCipyymY-dqHuuI15ya0XFbL9s88');
const discordBot = new Discord.Client({intents: [32767]});

// Обработчик команд и сообщений в Telegram
telegramBot.on('text', async (ctx) => {
    const message = ctx.message.text;

    // Отправка сообщения в Discord
    await discordBot.channels.cache.get('1109630447673151579').send(message);
    // await discordBot.channels.cache.get('1109630447673151579').send.command('!imagine');
});

// Обработчик сообщений в Discord
discordBot.on('message', async (message) => {

    // Отправка сообщения в Telegram
    await telegramBot.telegram.sendMessage('-952752031', 'ready');
});

// Запуск ботов
telegramBot.launch();
discordBot.login('MTEwOTYzMzA2MjkxODE3Mjc1Mg.G3frI5.7yItGL-o4mW3-y-SenWvVPGcWYVAivtHHowbKA');