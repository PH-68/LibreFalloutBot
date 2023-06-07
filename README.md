# LibreFalloutBot

LibreFalloutBot 是一個開放原始碼的機器人，試圖打破廢土伺服器中的付費牆。為一個PoC嘗試驗證對賭bot所需之技術困難度，PR和Issue是歡迎的。

## Features

- 開放原始碼，使得安全性可以被檢驗

- 使用 OAuth 登入，僅儲存 token 於本機，而母需明文儲存帳號密碼於文字檔，故可開啟 2FA，相對安全

- 尊重隱私，無遙測資料回傳(Telemetry)和ads

- 動態(浮動?跳動?)賠率，賠率是被發射器噴出之命名決定

- 使用兩個queue，故開獎和Pay錢速度可以被設定檔決定(避免Pay太快被踢出伺服器)

- 可限制每位玩家有多少request pending in queue

- 可記錄對賭結果並產生交易識別碼，記錄於csv

- 可選用Discord webhook

## Installation

### Use pre-built binaries

可以下載 Github release 之 binaries 或是 Github action 之 artifacts

若為 `.js` 之檔案則需 Node.js(18.16.0 LTS 是推薦的)

⚠️驗證 sha-512 和 GPG Key 是被鼓勵的

### Self Building

需先有 Node.js(18.16.0 LTS 是推薦的) 而後 `git clone`

接著 `npx tsc --outDir ./dist`

`npx pkg --compress Gzip -t (node18-linux-x64|node18-macos-x64|node18-win-x64) --out-path ./dist ./dist/bot.js` 是選用的，為了產生 exe

⚠️驗證 sha-512 和 GPG Key 是被鼓勵的

## Usage

 1. 需蓋好一包含紅石粉末以及投擲器之機台(須記下投擲器之座標)

 2. 命名物品，種類隨意，需固定格式為 `中獎 賠率 取代我為int or float賠率` 或 `未中獎 賠率 取代我為int or float賠率` 並放入機台

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

## Credits

- Mineflayer - under MIT License

- dotenv - under BSD 2-Clause License

- pkg - under MIT License

# LICENSE

This work is licensed under GNU AGPL-3.0-or-later

# Donate

考慮請杯咖啡吧，你的綠很寶貴，我的時間也同樣寶貴

Discord: F3C7#0255