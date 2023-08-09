# LibreFalloutBot

LibreFalloutBot 是一個開放原始碼的機器人，試圖打破廢土伺服器中的付費牆。為一個PoC嘗試驗證對賭bot所需之技術困難度，PR和Issue是歡迎的。

⚠️注意: 目前僅實作綠對賭，賭村之後果不被保證

⚠️注意: 請詳閱下方免責聲明

## Features

- 開放原始碼，使得安全性可以被檢驗

- 使用 OAuth 登入，僅儲存 token 於本機，而母需明文儲存帳號密碼於文字檔，故可開啟 2FA，相對安全

- 隱私始於設計(Privacy by design)，無遙測資料回傳(Telemetry)和ads

- 動態(浮動?跳動?)賠率，賠率是被發射器噴出之命名決定

- 使用兩個queue，故開獎和Pay錢速度可以被設定檔決定(避免Pay太快被踢出伺服器)

- 可限制每位玩家有多少request pending in queue

- 可記錄對賭結果並產生交易識別碼，記錄於csv

- 可選用Discord webhook

## Installation

### Use pre-built binaries

可以下載 [Github release](https://github.com/PH-68/LibreFalloutBot/releases) 之 binaries 或是 [Github actions](https://github.com/PH-68/LibreFalloutBot/actions) 之 artifacts

若為 `.js` 之檔案則需 Node.js(18.x	LTS 是推薦的)

⚠️驗證 sha-512 和 GPG Key 是被鼓勵的

### Self Building

需先有 Node.js(18.x	LTS 是推薦的) 而後 `git clone`

接著 `yarn` (prefered) or `npm i`

`npx tsc --outDir ./dist`

`npx pkg --compress Gzip -t (node18-linux-x64|node18-macos-x64|node18-win-x64) --out-path ./dist ./dist/bot.js` 是選用的，為了產生 exe

⚠️驗證 sha-512 和 GPG Key 是被鼓勵的

## Usage

 1. 需蓋好一包含紅石粉末以及投擲器之機台(須記下投擲器和紅石粉末之座標)

 2. 命名物品，種類隨意，需固定格式為 `中獎 賠率 取代為int or float賠率` 或 `未中獎 賠率 取代為int or float賠率` 並放入機台

 3. 創造於與執行檔同目錄下並調整 `.env` 設定檔內容以符合現實，使用環境變數也可以(詳見下方)

 4. 可以啟動Bot

## Environment variables

以下皆為必填，除非明確指出

`email = "string"` Microsoft帳號

`queueLimitPerUser = int` 限制玩家之 request pending 的數目

`debug = bool` 除錯模式(紀錄詳細資訊)

`dropperPosition = "int int int"` 投擲器座標(注意格式須完全一致，不可缺少或省略空白等)

`redstonePosition = "(int, int, int)"` 紅石粉座標(注意格式須完全一致，不可缺少或省略空白等)

`queueInterval = int` 多少毫秒開一次獎

`paymentQueueInterval = int` 多少毫秒Pay一次

`queueSkipLimit = int` 可容忍多少次開獎等待(小於)

`moneyLimit = int` 金錢上限，超過將會推進 Payment queue 然後退錢

`password = "string"` 請使得密碼足夠強壯，注意請勿使用真正的密碼，僅為產生交易識別碼用

`webhookURL = "string"` Discord webhook URL (可留空)

## FAQ

Q: 投擲器機率為多少

A: 可自行 decompile `DispenserBlockEntity.java` 得知為 $\frac{1}{n}$ ，考慮 n 為不為空的 slot

Q: Paper 對於 Random Number Generator 的調整

A: [Refer to this patch](https://github.com/PaperMC/Paper/blob/master/patches/server/0074-Use-a-Shared-Random-for-Entities.patch) 全分流共用一個 Seed

Q: How good is java.util.Random?

A: [How good is java.util.Random? - StackOverflow](https://stackoverflow.com/questions/453479/how-good-is-java-util-random)

考慮 java.util.Random 並不是 cryptographically secure 故 java.util.Random 的輸出是可以被預測的，但自從 Paper 對 RNG 的調整，這幾乎不可能

## Credits

- Mineflayer - under MIT License

- dotenv - under BSD 2-Clause License

- pkg - under MIT License

# LICENSE

This work is licensed under GNU AGPL-3.0-or-later

# Donate

考慮請杯咖啡吧，你的綠很寶貴，我的時間也同樣寶貴

Discord: f3c7

# Disclaimer of Warranty

THERE IS NO WARRANTY FOR THE PROGRAM, TO THE EXTENT PERMITTED BY
APPLICABLE LAW. EXCEPT WHEN OTHERWISE STATED IN WRITING THE COPYRIGHT
HOLDERS AND/OR OTHER PARTIES PROVIDE THE PROGRAM "AS IS" WITHOUT
WARRANTY OF ANY KIND, EITHER EXPRESSED OR IMPLIED, INCLUDING, BUT NOT
LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
A PARTICULAR PURPOSE. THE ENTIRE RISK AS TO THE QUALITY AND
PERFORMANCE OF THE PROGRAM IS WITH YOU. SHOULD THE PROGRAM PROVE
DEFECTIVE, YOU ASSUME THE COST OF ALL NECESSARY SERVICING, REPAIR OR
CORRECTION.

在適用法律允許的範圍內，對該程式沒有任何保證。除非另有書面說明，否則版權持有人和/或其他各方 "按原樣 "提供該程式，不提供任何明示或暗示的保證，包括但不限於對適銷性和特定用途的適用性的暗示保證。關於程式的品質和性能的全部風險由您承擔。如果該程式被證明有缺陷，您將承擔所有必要的服務、修理或糾正的費用。(Unoffical translation)
