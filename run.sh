#!/bin/sh

jq -c -n '[
	2,3,5,7
]' |
	wazero \
		run \
		main.wasm |
	xxd -ps |
	python3 \
		-m asn1tools \
		convert \
		-i der \
		-o xer \
		ints.asn \
		Integers \
		-
