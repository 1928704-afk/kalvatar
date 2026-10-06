#!/bin/bash

# ========================================================
# Kalvatar 로컬 개발 환경 원클릭 실행 스크립트
# ========================================================

set -e

echo "========================================================"
echo "🚀 [Kalvatar] 로컬 서비스 실행을 시작합니다..."
echo "========================================================"

# 1. Docker 컨테이너 (MySQL 8 & Redis 7) 구동
echo ""
echo "📦 [1/3] Docker 인프라 (MySQL & Redis) 컨테이너 기동 중..."
if command -v docker &> /dev/null; then
    docker compose -f docker/docker-compose.yml up -d
    echo "✅ MySQL(3306) 및 Redis(6379) 컨테이너가 정상 실행되었습니다."
else
    echo "⚠️ Docker가 설치되어 있지 않거나 실행 중이지 않습니다. Docker Desktop을 먼저 실행해주세요."
fi

# 2. 백엔드 빌드 및 실행 안내
echo ""
echo "☕ [2/3] 백엔드 (Spring Boot 3.2) 실행 방법:"
echo "   새 터미널 탭에서 아래 명령어를 실행하세요:"
echo "   ----------------------------------------"
echo "   cd backend"
echo "   ./gradlew bootRun"
echo "   ----------------------------------------"

# 3. 모바일 앱 (React Native / Expo) 실행
echo ""
echo "📱 [3/3] 모바일 앱 (Expo) 의존성 설치 및 실행 준비:"
read -p "지금 모바일 앱(Expo)을 실행하시겠습니까? (y/n): " choice

if [ "$choice" = "y" ] || [ "$choice" = "Y" ]; then
    echo "📦 npm 패키지 설치 중..."
    cd mobile
    npm install
    echo "🚀 Expo 개발 서버를 시작합니다..."
    echo "💡 키보드 'i'를 누르면 iOS 시뮬레이터, 'w'를 누르면 웹 브라우저에서 열립니다."
    npx expo start
else
    echo "💡 수동 실행 방법:"
    echo "   cd mobile && npm install && npx expo start"
fi
