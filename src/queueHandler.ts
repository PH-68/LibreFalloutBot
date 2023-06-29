import { getBot } from "./bot";
import { logMessage, sentPrivateMessage } from "./messageHandler";
import { PaymentActions, logTransaction, pushPaymentQueue } from "./paymentQueueHandler";

let queue: Array<[string, number]> = [], lock = false, queueCountPerUser = {}, queueSkipCount = 0;

export function checkQueue(bot) {
    if (queue.length != 0 && !lock) {
        lock = true
        queueSkipCount = 0
        const redstoneWire = bot.findBlock({ matching: bot.registry.blocksByName["redstone_wire"].id, maxDistance: 10, count: 1 })
        if (process.env.redstonePosition != redstoneWire.position)
            throw "The position of redstone wire isn't valid"
        bot.activateBlock(redstoneWire)
    }
    else if (queueSkipCount >= Number(process.env.queueSkipLimit)) {
        const userInfo = queue.shift()!
        pushPaymentQueue(userInfo[0], userInfo[1], PaymentActions.Refund)
        queueCountPerUser[userInfo[0]]--
        lock = false
        queueSkipCount = 0
    }
    else if (lock) {
        logMessage(bot, `Timeout x${queueSkipCount}`, true)
        queueSkipCount++
    }
}

export function queuePush(user: string, base: number) {
    queueCountPerUser[user] = queueCountPerUser[user] == undefined ? 1 : queueCountPerUser[user]
    if (queueCountPerUser[user] > Number(process.env.queueLimitPerUser)) {
        logMessage(getBot(), `${user} Queue limit exceeded`, false)
        sentPrivateMessage(getBot(), user, "&cUser queue limit exceeded. Further request would nither refund nor enqueue.")
    }
    else {
        const currentDateString = new Date(new Date().setHours(new Date().getHours() + 8)).toJSON().slice(0, -5) + "GMT+8";
        logTransaction(user, base, PaymentActions.Received, currentDateString)
        queue.push([user, base])
        queueCountPerUser[user]++
    }
}

export function queueShift() {
    if (verifyQueueStatus()) {
        lock = false
        queueCountPerUser[queue[0][0]]--
        return queue.shift()!
    }
}

export function verifyQueueStatus() {
    if (queue.length == 0)
        return false
    if (queue[0][0] == "")
        return false
    if (Number.isNaN(queue[0][1]))
        return false

    return true
}
