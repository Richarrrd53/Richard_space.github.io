const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || '3000';
const host = process.env.HOST || '127.0.0.1';

if (!/^\d+$/.test(port) || Number(port) < 1 || Number(port) > 65535) {
    console.error('PORT must be an integer between 1 and 65535');
    process.exit(1);
}

app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'main.html')));
app.get('/get-islocalhost', (req, res) => res.send('islocalhost'));
app.get('/get-content/:ch', (req, res) => {
    if (!/^[1-9]\d*$/.test(req.params.ch)) {
        return res.status(400).json({ error: '無效的章節編號' });
    }
    const file = path.join(__dirname, 'public', 'data', `ch${req.params.ch}.txt`);
    fs.readFile(file, 'utf8', (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') return res.status(404).send('找不到章節');
            console.error('讀取資料錯誤:', err);
            return res.status(500).send('無法讀取資料');
        }
        res.type('text/plain').send(data);
    });
});

const server = app.listen(Number(port), host, () => {
    console.log(`伺服器運行在 http://${host}:${port}`);
});

function shutdown() {
    server.close(() => process.exit(0));
}
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
