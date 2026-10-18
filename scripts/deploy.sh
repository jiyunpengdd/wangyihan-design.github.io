#!/usr/bin/env bash
# 构建并发布到 han-design.top 所在的 ECS。
# 用法：./scripts/deploy.sh
set -euo pipefail

cd "$(dirname "$0")/.."

HOST="${DEPLOY_HOST:-root@47.95.254.90}"
KEY="${DEPLOY_KEY:-$HOME/.ssh/aliyun_pdd_license_ed25519}"
TARGET="${DEPLOY_PATH:-/var/www/han-design}"

echo "==> 构建"
npm run build

echo "==> 上传 dist 到 $HOST:$TARGET"
rsync -az --delete -e "ssh -i $KEY -o BatchMode=yes" dist/ "$HOST:$TARGET/"

echo "==> 修正文件归属"
ssh -i "$KEY" -o BatchMode=yes "$HOST" "chown -R www-data:www-data $TARGET"

echo "==> 验证"
code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 https://han-design.top/ || true)
echo "https://han-design.top/ -> ${code:-连接失败}"
if [ "${code:-}" != "200" ]; then
  echo "注意：首页没有返回 200，去服务器上看 tail /var/log/nginx/error.log"
fi
