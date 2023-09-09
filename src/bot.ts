import { logMessage, onDropperEject, onInsufficientBalance, onUserPay, sentChatMessage } from "./messageHandler";
import { registerPaymentTimer } from "./paymentQueueHandler";
import { checkQueue } from "./queueHandler";

var mineflayer = require('mineflayer');
require('dotenv').config();

const botOptions = {
    host: ((process.env.host == undefined) || (process.env.host == "")) ? "mcfallout.net" : process.env.host,
    port: 25565,
    username: process.env.email,
    auth: 'microsoft',
    viewDistance: 2
}

const bot = mineflayer.createBot(botOptions);

bot.on("spawn", async () => {
    await bot.waitForChunksToLoad()
    setInterval(checkQueue, Number(process.env.queueInterval), getBot())
    registerMessageListener(getBot())
    registerPaymentTimer(Number(process.env.paymentQueueInterval!))
    if (getBot().findBlock({ matching: bot.registry.blocksByName["redstone_wire"].id, maxDistance: 10, count: 1 }) == null)
        throw "redstone_wire isn't in nearby(make sure bot is in the right position)"

    logMessage(getBot(), "Running in debug mode", true)
    sentChatMessage(getBot(), `Initialized (LibreFalloutBot is lisenced under GNU AGPL-3.0-or-later)`)
    logMessage(getBot(), "Redstone wire detected at " + getBot().findBlock({ matching: bot.registry.blocksByName["redstone_wire"].id, maxDistance: 10, count: 1 }).position, true)
})

function registerMessageListener(bot) {
    bot.on('message', onDropperEject)
    bot.on('message', onUserPay)
    bot.on('message', onInsufficientBalance)
}

export function getBot() {
    return bot;
}

bot.on('end', console.log)
bot.on('error', console.log)

process.on('uncaughtException', UncaughtExceptionHandler);

function UncaughtExceptionHandler(err)
{
    console.log("Uncaught Exception");
    console.log("err: ", err);
    console.log("Stack trace: ", err.stack);
    setInterval(function(){}, 1000);
    getBot().quit()
}