#!/bin/bash

# 환경 변수 설정
export APP_ENV=production
export APP_PORT=8000
export DB_URL="mysql://root:kweonminsungabcd1234@15.165.186.225:52622/malgreem"
export IMAGE_GEN_API_URL="http://ai.malgreem.minsung.kr"
export INMEMORY_DB_URL="redis://admin:Kweonminsung_1234@redis-16268.c340.ap-northeast-2-1.ec2.redns.redis-cloud.com:16268"
export SESSION_DB_URL="redis://admin:Kweonminsung_1234@redis-16268.c340.ap-northeast-2-1.ec2.redns.redis-cloud.com:16268"
export SESSION_KEY="secret_key"

# PM2로 앱 실행
cd backend
pm2 restart npm --name "backend" -- run start