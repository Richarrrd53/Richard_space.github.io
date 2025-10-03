const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const hostname = '127.0.0.1';
const fs = require("fs");
const { marked } = require('marked');


app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'main.html'));
});

app.use(express.json());
app.use(bodyParser.json());

app.get("/get-islocalhost", (req, res) => {
    res.send("islocalhost");
});

app.get("/get-content/:ch", (req, res) => {
    const chNum = req.params.ch;
    if (!chNum) {
        return res.status(400).json({ error: '缺少章節編號' });
    }
    const textFileDir = path.join(__dirname, "public/data/ch" + chNum + ".txt");
    fs.readFile(textFileDir, "utf-8", (err, data) => {
        if (err){
            console.error('讀取資料錯誤:', err);
            res.send("無法讀取資料...");
        }
        else{
            res.send(data);
        }
    });
});

app.listen(port, () => {
    console.log(`伺服器運行在 http://${hostname}:${port}`);
});