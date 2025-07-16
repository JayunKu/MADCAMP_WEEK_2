#!/bin/bash

# PM2로 앱 실행
cd ai_image_server
source venv/bin/activate
pm2 restart app.py --interpreter python3 --name ai_image_server