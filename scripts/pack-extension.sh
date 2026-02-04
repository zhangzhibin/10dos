#!/usr/bin/env bash
# 打包 extension 目录为 zip，用于 Chrome 商店提交（排除开发用文件）
set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
VERSION=$(node -p "require('./package.json').version")
mkdir -p "$ROOT/dist"
cd "$ROOT/extension"
zip -r "../dist/10dos-${VERSION}.zip" . -x "*.DS_Store"
cd "$ROOT"
echo "Created dist/10dos-${VERSION}.zip"
