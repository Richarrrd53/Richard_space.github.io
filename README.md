# Rocky Linux 9 部署

使用 Node.js 22 LTS（含 npm）及 PM2。請在 Rocky Linux 主機上重新安裝依賴，不要複製 Windows 的 `node_modules`。

```bash
cd /path/to/project
npm ci --omit=dev
npm install -g pm2
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
```

依 `pm2 startup` 顯示的指令設定 systemd 開機啟動，然後再次執行 `pm2 save`。預設只監聽 `127.0.0.1:3000`，適合透過反向代理對外提供服務。若要直接監聽網路介面，可先設定環境變數，例如：

```bash
HOST=0.0.0.0 PORT=3000 pm2 start ecosystem.config.cjs --update-env
```

變更環境變數後，使用 `HOST=0.0.0.0 PORT=3000 pm2 restart richards-space --update-env`，再執行 `pm2 save`。直接對外連線時，需依主機的防火牆與網路政策開放對應埠號。

可用 `curl http://127.0.0.1:3000/get-islocalhost` 檢查服務，並使用 `pm2 status`、`pm2 logs richards-space` 查看狀態和日誌。

## 透過 Apache 部署在 /app/

在 HTTPS 的 VirtualHost 中，將整個 `/app/` 轉送給 Node.js（需要啟用 Apache 的 proxy 和 proxy_http 模組）：

```apache
RedirectMatch ^/app$ /app/
ProxyPass /app/ http://127.0.0.1:3000/
ProxyPassReverse /app/ http://127.0.0.1:3000/
```

檢查設定後重新載入 Apache，並確認 `curl https://你的網域/app/get-islocalhost` 回傳 `islocalhost`。請保留 `/app/` 結尾的斜線；反向代理必須轉送靜態檔案及 API，不能只提供靜態目錄。更新程式碼後執行 `pm2 restart richards-space`。
