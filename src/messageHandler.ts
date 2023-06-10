import { getBot } from "./bot"
import { PaymentActions, pushPaymentQueue } from "./paymentQueueHandler"
import { queuePush, queueShift, verifyQueueStatus } from "./queueHandler"



export async function onDropperEject(jsonMsg) {
    let message = jsonMsg.toString()
    if (isValidDropperMessage(message) && isValidBlockPosition(message) && verifyQueueStatus()) {
        message = message.split(" ")
        const userInfo = queueShift()!
        logMessage(getBot(), jsonMsg.toString(), false)
        pushPaymentQueue(userInfo[0], userInfo[1] * Number(message[5]), Number(message[5]) ? PaymentActions.Win : PaymentActions.Lose)
    }
    else if (message.indexOf("[區域]") == 0) {
        throw `[區域] was send but it's not valid(make sure the channel isn't using)(${jsonMsg.toString()})`
    }
}

//onUserPay
export async function onUserPay(jsonMsg) {
    const message = jsonMsg.toString()
    if (isValidPaymentMessage(message)) {
        const user = message.split(" ")[2]
        const base = Number(message.split(" ")[4].replaceAll(",", ""))
        if (base > Number(process.env.moneyLimit)) {
            sentPrivateMessage(getBot(), user, "Money limit exceeded! If you believe it's an error, contact instance owner. Refunding...")
            pushPaymentQueue(user, base, PaymentActions.Refund)
        }
        else
            queuePush(user, base)
    }
}

export async function onInsufficientBalance(jsonMsg) {
    const message = jsonMsg.toString()
    if (message.indexOf("[系統]") == 0 && message.includes("綠寶石不足")) {
        logMessage(getBot(), "Insufficient Balance! Last payment didn't succeed", false)
        throw "Insufficient Balance"
    }
}

export function logMessage(bot, message: string, isDebug: boolean) {
    if (process.env.debug == "true" && isDebug) {
        message = "[Debug] " + message
        sentChatMessage(bot, message)
    }
    else if (!isDebug) {
        console.log(message)
    }
    postWebhookMessage(`[Log] ${message}`)
}

export function sentPrivateMessage(bot, user: string, message: string) {
    bot.chat(`/m ${user} ${message}`)
    postWebhookMessage(`[PM] ${user} ${message}`)
}
export function sentChatMessage(bot, message: string) {
    console.log(message)
    bot.chat(`${message}`)
    postWebhookMessage(`[Chat] ${message}`)
}
export function sentCommand(bot, message: string) {
    bot.chat(`${message}`)
    postWebhookMessage(`[Command] ${message}`)
}

function postWebhookMessage(message: string) {
    fetch(process.env.webhookURL!, {
        method: "POST", headers: { "Content-Type": "application/json", }, body: JSON.stringify({ "content": message })
    })
}

function isValidDropperMessage(message: string) {
    return message.indexOf("[區域]") == 0 && !message.includes("<") && !message.includes(">") && message.includes("中獎 賠率")
}

function isValidBlockPosition(message: string) {
    let messageChunk = message.split(" ")
    const position = process.env.dropperPosition!.split(" ")
    return (messageChunk[11] == position[0] && messageChunk[12] == position[1] && messageChunk[13] == position[2]);
}

function isValidPaymentMessage(message: string) {
    return (message.indexOf("[系統]") == 0 && message.includes("轉帳") && message.includes("收到"))
}