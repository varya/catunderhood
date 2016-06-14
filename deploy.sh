#!/bin/bash
set -e

echo "set git environment"
git config user.email "mail@varya.me"
git config user.name "Tachikoma Zombie"
git remote rm origin
git remote add origin https://varya:${GITHUB_TOKEN}@github.com/varya/catunderhood.git
git checkout master

echo "run update"
babel-node update

echo "save dump"
git add --all dump
git commit -m $'save dump\n\n[ci skip]'
git push origin master &>/dev/null

echo "build'n'deploy"
npm run deploy
