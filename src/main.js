import {session, Telegraf} from 'telegraf'
import { message } from 'telegraf/filters'
import {code, link} from 'telegraf/format'
import config from 'config'
import { ogg } from './ogg.js'
import { removeFile } from './utils.js'
import {chatMidGen} from './apiMed.js'
import {kerDown} from "./imgdownloader.js";
import {chatMidGen2} from './apiMedGiveImg.js'
import {buttons} from './buttonsMid.js'
import {buttonGetId} from './getButtonId.js'
import { initCommand, newChatKer, chatGen, transcription, generateIamge, INITIAL_SESSION } from './openai.js'
import path, {dirname, resolve} from "path";
import {fileURLToPath} from "url";
import fs, {createWriteStream} from "fs";
import axios from "axios";
const __dirname = dirname(fileURLToPath(import.meta.url))

const bot = new Telegraf(config.get('TELEGRAM_TOKEN'))

// говорим боту, чтобы он использовал session
bot.use(session())

// при вызове команды new и start бот регистрирует новую беседу,
// новый контекс
bot.command('new', newChatKer)
bot.command('start', initCommand)
bot.command('pict', sendGenImage)
bot.command('mid', sendMid)

async function sendMid(ctx){
    const tmp = ctx.message.text.substring(5, ctx.message.text.length)

    let msgId = await chatMidGen(ctx, tmp);

    await ctx.reply("Запрос отправлен!");
    console.log(msgId);

    let imageUr = await chatMidGen2(ctx, msgId);
    await kerDown(imageUr, msgId);

    await ctx.replyWithPhoto({ source: `${msgId}.png` });
    await ctx.reply(tmp);

    let buttonId = await buttonGetId(ctx, msgId);
    let U1 = await buttons(ctx, "U1", buttonId);
    console.log(U1)
    await kerDown(U1, `${buttonId}U1`);
    await ctx.replyWithDocument({ source: `${buttonId}U1.png` });
}
async function sendGenImage(ctx) {
    const tmp = ctx.message.text.substring(6, ctx.message.text.length);
    try {
        await ctx.reply('Сообщение принял. Жду ответ от сервера...')
        const ker = await generateIamge(tmp)

        const mediaGroup = [
            {
                type: 'photo',
                media: ker[0],
                caption: tmp,
            },
            {
                type: 'photo',
                media: ker[1],
                caption: tmp,
            },
            {
                type: 'photo',
                media: ker[2],
                caption: tmp,
            },
            {
                type: 'photo',
                media: ker[3],
                caption: tmp,
            },
        ];

        await ctx.telegram.sendMediaGroup(ctx.message.chat.id, mediaGroup)
    } catch (e) {
        await ctx.reply("Повторите запрос позже!")
        console.log(`Error while image message`, e.message)
    }
}

bot.on(message('voice'), async (ctx) => {
    // если сессия не определилась, создаем новую
try {
    await ctx.reply('Сообщение принял. Жду ответ от сервера...')
    const link = await ctx.telegram.getFileLink(ctx.message.voice.file_id)
    const userId = String(ctx.message.from.id)
    const oggPath = await ogg.create(link.href, userId)
    const mp3Path = await ogg.toMp3(oggPath, userId)
    await removeFile(oggPath)
    const text = await transcription(mp3Path)
    await ctx.reply(code(`Ваш запрос: ${text}`))
    await chatGen(ctx, text)
} catch (e) {
    await ctx.reply("Повторите запрос позже!")
    console.log(`Error while voice message`, e.message)
}
})

bot.on(message('text'), async (ctx) => {
    try {
        await ctx.reply('Сообщение принял. Жду ответ от сервера...')
        await chatGen(ctx, ctx.message.text)
    } catch (e){
        await ctx.reply("Повторите запрос позже!")
            console.log(`Error while image message`, e.message)
        }
})

bot.on(message('photo'), async (ctx) => {
    try {
        await ctx.reply('принял. Жду ответ от сервера...');
        const d = ctx.message.photo;
        const dis = ctx.message.caption
        console.log(dis)
        const url = await ctx.telegram.getFileLink(d[d.length - 1].file_id);
        console.log(url.href)
        const res = await ogg.kerSuka(url.href)
        await ctx.reply(code(res))
        await chatGen(ctx, (dis + "\n" + res))
    } catch (error) {
        await ctx.reply("Повторите запрос позже!")
        // Обработка ошибок
        console.error(error);
    }
});

bot.launch()

