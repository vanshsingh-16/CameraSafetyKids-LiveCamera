#!/data/data/com.termux/files/usr/bin/bash
set -e
cd "$(dirname "$0")"
command -v node >/dev/null 2>&1 || pkg install nodejs -y
npm install --silent
if command -v cloudflared >/dev/null 2>&1; then
  echo "Starting local server and Cloudflare Tunnel..."
  (npm start) & SERVER_PID=$!
  trap 'kill $SERVER_PID 2>/dev/null || true' EXIT
  sleep 2
  cloudflared tunnel --url http://127.0.0.1:3000
else
  echo "Starting local server..."
  echo "Open http://127.0.0.1:3000"
  echo "For public HTTPS, install cloudflared separately and run: cloudflared tunnel --url http://127.0.0.1:3000"
  npm start
fi
