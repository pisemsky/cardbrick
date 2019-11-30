#!/usr/bin/env sh

set -e

npm run build

cd dist

echo 'cardbrick.pisemsky.com' > CNAME

git init
git add -A
git commit -m 'deploy'

git push -f https://github.com/pisemsky/cardbrick.git master:gh-pages

cd -
