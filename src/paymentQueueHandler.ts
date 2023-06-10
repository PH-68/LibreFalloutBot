import { getBot } from "./bot";
import { sentChatMessage, sentCommand } from "./messageHandler";

import * as crypto from "crypto";
const fs = require('fs');

let queue: Array<[string, number, string, string]> = []

function makeTransaction(bot, user: string, amountOfMoney: number, actionType: string, currentDateString: string) {
    amountOfMoney = Math.floor(amountOfMoney)
    logTransaction(user, amountOfMoney, actionType, currentDateString)

    if (Number.isNaN(amountOfMoney)) {
        sentChatMessage(bot, `[${currentDateString}] &6${user} &cTransaction failed(number is NaN)`)
        return false
    }
    sentCommand(bot, `/pay ${user} ${amountOfMoney}`)
    return [currentDateString, getRandomString(currentDateString, 3)]
}

export function registerPaymentTimer(duration: number) {
    setInterval(checkPaymentQueue, duration)
}

function checkPaymentQueue() {
    if (queue.length != 0) {
        const userInfo = queue.shift()!
        makeTransaction(getBot(), userInfo[0], userInfo[1], userInfo[2], userInfo[3])
    }
}

export function pushPaymentQueue(user: string, amountOfMoney: number, actionType: string) {
    if (user != "" && Number.isNaN(amountOfMoney), actionType != "") {
        const currentDateString = new Date(new Date().setHours(new Date().getHours() + 8)).toJSON().slice(0, -5) + "GMT+8";
        sentChatMessage(getBot(), `[${currentDateString}] [${getRandomString(currentDateString, 3)}] &6${user} &c[${actionType}] ${amountOfMoney}`)
        queue.push([user, amountOfMoney, actionType, currentDateString])
    }
}

export function logTransaction(user: string, amountOfMoney: number, actionType: string, currentDateString: string) {
    fs.appendFile('./transactionLog.csv', `${currentDateString},${getRandomString(currentDateString, 3)},${user},${amountOfMoney},${getKeyName(actionType)}\n`, function (err) {
        if (err) throw err;
    });
}

function getRandomString(salt, length) {
    return crypto.scryptSync(process.env.password!, salt, length, { N: 1024 }).toString("base64");
}

function getKeyName(value: string) {
    return Object.entries(PaymentActions).find(([key, val]) => val === value)?.[0];
}

export enum PaymentActions {
    Refund = "Refund",
    Lose = "未中獎",
    Win = "中獎",
    Received = "收到"
}