#!/bin/bash

python3 ${GIMMICK_PATH}/src/bin/gimmick.py
kill -9 `ps -ef |grep python3 | awk '{print $2}'`
rmdir .gimmick_lock
echo "App closed"
