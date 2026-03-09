#!/bin/bash

python3 ${GRELION_PATH}/src/bin/grelion.py
kill -9 `ps -ef |grep python3 | awk '{print $2}'`
rmdir .gimmick_lock
echo "App closed"
