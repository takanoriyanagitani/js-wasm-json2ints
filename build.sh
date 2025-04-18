#!/bin/sh

echo bundling...
npx \
	esbuild \
	index.mjs \
	--bundle \
	--outfile=./out.js \
	--format=esm

echo building...
javy \
	build \
	-o main.wasm \
	out.js
