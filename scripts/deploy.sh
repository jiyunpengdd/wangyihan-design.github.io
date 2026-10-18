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

echo "==> 验证（在服务器上跑，本机网络不可靠）"
SITE_URL="${DEPLOY_URL:-https://han-design.top}"
SITE_HOST="${SITE_URL#https://}"
code=$(ssh -i "$KEY" -o BatchMode=yes "$HOST" \
  "curl -s -o /dev/null -w '%{http_code}' --resolve ${SITE_HOST}:443:127.0.0.1 ${SITE_URL}/" || true)
echo "${SITE_URL}/ -> ${code:-连接失败}"
if [ "${code:-}" != "200" ]; then
  echo "注意：首页没有返回 200，去服务器上看 tail /var/log/nginx/error.log"
fi
