#!/bin/sh

npm i
npm run build
npm prune
npm run start