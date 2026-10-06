# 🌟 Kalvatar (칼바타)

> **AI 일정 자동화 및 위치 기반 실시간 캐릭터 소셜 서비스**  
> *"일정을 적으면 행동 루틴이 시작되고, 지도 위 캐릭터가 함께 움직입니다."*

---

## 📁 프로젝트 구조 (Repository Structure)

```
kalvatar/
├── docs/                           # 📚 기획 및 시스템 설계 문서 세트 (v1.0 ~ v1.1)
│   ├── SPECIFICATION.md            # [기획] 통합 기획 명세서 (PRD v1.1)
│   ├── SCREEN_SPECIFICATION.md     # [화면] UI/UX 와이어프레임 & 화면 정의서
│   ├── DATABASE_ERD.md             # [DB] 데이터 모델링 및 MySQL/Redis ERD 명세서
│   ├── API_SPECIFICATION.md        # [API] RESTful & WebSocket STOMP 프로토콜 명세서
│   ├── SYSTEM_ARCHITECTURE.md      # [아키텍처] 적응형 위치 수집 엔진 & 배터리 최적화
│   └── USER_SCENARIOS_AND_WBS.md   # [일정] E2E 사용자 시나리오 & 8주간 WBS 계획
│
├── docker/                         # 🐳 로컬 인프라 환경
│   ├── docker-compose.yml          # MySQL 8.0 & Redis 7.0 컨테이너 정의
│   └── mysql/init.sql              # 초기 DB 스키마 생성 DDL
│
├── backend/                        # ☕ 백엔드 서비스 (Spring Boot 3.2.x, Java 17)
│   ├── Dockerfile                  # 멀티스테이지 컨테이너 빌드 파일
│   ├── build.gradle & settings.gradle
│   └── src/main/java/com/kalvatar/
│       ├── domain/                 # user, friend, schedule, activity 도메인 엔티티 & 레포지토리
│       └── global/                 # Security(JWT), Redis, WebSocket(STOMP), 공통 응답 봉투
│
└── mobile/                         # 📱 모바일 앱 클라이언트 (React Native / Expo, TypeScript)
    ├── package.json & app.json
    ├── App.tsx                     # 메인 진입점
    └── src/
        ├── navigation/             # 4대 탭 네비게이션 (지도, 캘린더, 친구, MY)
        ├── screens/                # MapScreen, CalendarScreen, FriendsScreen, MyPageScreen
        └── types/                  # 공통 TypeScript 인터페이스 정의
```

---

## 🚀 빠른 시작 가이드 (Quick Start)

### 1. 로컬 인프라 실행 (MySQL & Redis)
```bash
cd docker
docker compose up -d
```
- **MySQL 8.0**: `localhost:3306` (DB: `kalvatar_db`, User: `kalvatar_user`, PW: `kalvatar_password`)
- **Redis 7.0**: `localhost:6379`

### 2. 백엔드 실행 (Spring Boot)
```bash
cd backend
# 로컬에 Java 17+ 가 설치된 경우
./gradlew bootRun

# 또는 Docker를 통한 실행
docker build -t kalvatar-backend .
docker run -p 8080:8080 --network kalvatar-network kalvatar-backend
```

### 3. 모바일 앱 실행 (Expo / React Native)
```bash
cd mobile
npm install
npx expo start
```
- iOS 시뮬레이터(`i`), Android 에뮬레이터(`a`), 또는 모바일 Expo Go 앱으로 QR 코드를 스캔하여 실행합니다.

---

## 🛠️ 핵심 기술 스택
- **Mobile**: React Native, TypeScript, Expo, React Navigation, React Native Maps, Reanimated
- **Backend**: Spring Boot 3.2.4, Spring Security, Spring Data JPA, MySQL 8.0, Redis 7.0, WebSocket (STOMP)
- **AI**: LLM Structured Outputs (OpenAI / Gemini)
- **Infra**: Docker Compose, AWS EC2/RDS/ElastiCache
