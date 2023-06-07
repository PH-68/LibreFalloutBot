var mineflayer = require('mineflayer');
require('dotenv').config();
//var mc = require('minecraft-protocol');

const botOptions = {
    host: "mcfallout.net",
    port: 25565,         // optional
    username: process.env.email,
    auth: 'microsoft',
    //username: "email",
    viewDistance: 2
}

const bot = mineflayer.createBot(botOptions);

//let queue: Array<[String, Number]>, lock = false;
let queue = [], lock = false, validDict = {}, queueLengthPerUser = {};

async function doBet() {
    lock = true
    //const at = bot.entity.position.floored()
    bot.activateBlock(bot.findBlock({ matching: 665 }))
}

function checkQueue() {
    if (queue.length != 0 && !lock) {
        doBet()
    }
    else if (lock) {
        bot.chat("failed" + queue.shift())
        console.log("failed")
    }
}



bot._client.on('packet', function (packet) {
    if (packet.hasOwnProperty("entityId") && packet.hasOwnProperty("objectUUID") && packet.hasOwnProperty("x")) {
        validDict[packet.entityId] = validateBlockPosition(packet)
    }
})

var entityId = 0;
bot._client.on('packet', function (packet) {
    if (packet.hasOwnProperty("entityId") && packet.hasOwnProperty("metadata")) {
        if (packet.metadata[0].hasOwnProperty("type") && packet.metadata[0].type == 7 && packet.metadata[0].hasOwnProperty("value") && packet.entityId != entityId) {
            //if (queue.length != 0 && validDict[packet.entityId]) {
            if (validDict[packet.entityId]) {
                const userInfo = queue.shift()
                //const userInfo = ["dsf", 10]
                if (packet.metadata[0].value.itemId == 517) {
                    bot.chat(`中獎 ${Math.floor(userInfo[1] * Number(process.env.multiplier))} ${userInfo[0]} reminding:${queue.length}`)
                    bot.chat(`/pay ${userInfo[0]} ${Math.floor(userInfo[1] * Number(process.env.multiplier))}`)
                    logDebug(`/pay ${userInfo[0]} ${Math.floor(userInfo[1] * Number(process.env.multiplier))}`)
                    console.log(`/pay ${userInfo[0]} ${Math.floor(userInfo[1] * Number(process.env.multiplier))}`)
                    console.log(packet.metadata[0].value.itemId)
                }
                else if (packet.metadata[0].value.itemId == 532) {
                    bot.chat(`無中獎 ${userInfo[0]} reminding:${queue.length}`)
                    console.log(`無中獎 ${userInfo[0]} reminding:${queue.length}`)
                    console.log(packet.metadata[0].value.itemId)
                }
                validDict = {}
                queueLengthPerUser[userInfo[0]]--
                entityId = packet.entityId
                console.log(queue)
            }
            console.log(packet)
        }
    }
    if (packet.hasOwnProperty("entityId") && packet.entityId == entityId && packet.hasOwnProperty("yaw") && packet.hasOwnProperty("x")) {
        console.log(packet)
    }
    lock = false
});


//"[系統] 您收到了 LuYao_ 轉帳的 18 綠寶石 (目前擁有 10 綠寶石)"
bot.on('message', async (jsonMsg, position) => {
    const message = jsonMsg.toString()
    if (message.indexOf("[系統]") == 0 && message.indexOf("轉帳") != -1 && message.indexOf("收到") != -1) {
        //if (message.indexOf("轉帳") != -1) {
        const username = message.split(" ")[2]
        const base = Number(message.split(" ")[4])
        queueLengthPerUser[username] = queueLengthPerUser[username] == undefined ? 1 : queueLengthPerUser[username]
        if (queueLengthPerUser[username] > Number(process.env.queueLimitPerUser)) {
            bot.chat(`m ${username} You've reached your queue limit. Further request would nither refund nor be pushed into the held queue`)
        }
        else {
            queue.push([username, base])
            queueLengthPerUser[username]++
            console.log("收到" + username)
        }
    }
    if (message.indexOf("中獎(") != -1) {
        console.log(message)
    }
})

bot.on("spawn", async () => {
    await bot.waitForChunksToLoad()
    setInterval(checkQueue, 3000)
    bot.chat("Initialized")
    console.log("Initialized")
    logDebug("Running in debug mode")
    logDebug("Redstone wire detected at " + bot.findBlock({ matching: bot.registry.blocksByName["redstone_wire"].id, maxDistance: 10, count: 1 }))
})


function validateBlockPosition(packet) {
    if (packet.hasOwnProperty("x") && packet.hasOwnProperty("y") && packet.hasOwnProperty("z")) {
        const botPos = bot.entity.position
        const distance = Math.sqrt(Math.pow(botPos.x - packet.x, 2) + Math.pow(botPos.y - packet.y, 2) + Math.pow(botPos.z - packet.z, 2))
        //logDebug(distance + " " + String(distance < Number(process.env.distanceLimit)))
        console.log(distance)
        return distance < Number(process.env.distanceLimit)
    }
    return false
}

function logDebug(message) {
    if (process.env.debug == "true") {
        message = "[Debug] " + message
        bot.chat(message)
        console.log(message)
    }
}

bot.on('error', console.log)