#!/usr/bin/env bash
# Publish the committed site files to Hetzner (Caddy serves /var/www/19church/current).
# Run from the repo root. Only index.html, robots.txt and assets/ are published.
set -euo pipefail
sha=$(git rev-parse HEAD)
if [ -n "$(git status --porcelain -- index.html robots.txt assets)" ]; then
  echo "Uncommitted site files; commit first" >&2
  exit 1
fi
stage=/tmp/19church-upload-$sha
ssh hetzner "rm -rf $stage && mkdir -p $stage/assets"
scp -q index.html robots.txt "hetzner:$stage/"
scp -q assets/* "hetzner:$stage/assets/"
ssh hetzner "set -e
  sudo mkdir -p /var/www/19church/releases
  sudo rm -rf /var/www/19church/releases/$sha
  sudo cp -r $stage /var/www/19church/releases/$sha
  sudo find /var/www/19church -type d -exec chmod 755 {} +
  sudo find /var/www/19church -type f -exec chmod 644 {} +
  sudo ln -sfn /var/www/19church/releases/$sha /var/www/19church/current.new
  sudo mv -T /var/www/19church/current.new /var/www/19church/current
  rm -rf $stage
  echo Activated 19 Church release $sha"
