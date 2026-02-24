import 'dotenv/config';
import { Telegraf } from 'telegraf';
import OpenAI from 'openai';

const bot = new Telegraf(process.env.BOT_TOKEN);
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

bot.start(async (ctx) => {
  await ctx.reply('Привет. Опиши коротко, что сейчас происходит с канализацией?');
});

bot.on('text', async (ctx) => {
  const userText = ctx.message.text;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `
Ты инженер-консультант по автономной канализации.
Отвечай коротко, по-человечески, без шаблонных списков.
Задавай один уточняющий вопрос за раз.
Если ситуация требует уточнения голосом — мягко предложи оставить номер.
          `,
        },
        {
          role: 'user',
          content: userText,
        },
      ],
      temperature: 0.7,
    });

    const reply = response.choices[0].message.content;
    await ctx.reply(reply);
  } catch (error) {
    console.error(error);
    await ctx.reply('Произошла ошибка. Попробуйте ещё раз.');
  }
});

bot.launch();
console.log('Bot started');
