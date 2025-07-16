#!/bin/bash

# 환경 변수 설정
export REACT_APP_ENV=production
export REACT_APP_GOOGLE_OAUTH_CLIENT_ID=1065338590932-h3ns1ekdk3gvankvtn6r6868d62s7g2l.apps.googleusercontent.com
export REACT_APP_API_BASE_URL=http://api.malgreem.minsung.kr
export REACT_APP_WEBSOCKET_URL=http://api.malgreem.minsung.kr/ws

# PM2로 앱 실행
cd frontend
pm2 start npm --name "frontend" -- run start