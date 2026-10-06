# [Kalvatar] API 및 실시간 통신 명세서 (v1.0)

본 문서는 **Kalvatar (AI 일정 자동화 및 위치 기반 실시간 캐릭터 소셜 앱)**의 **RESTful API** 및 **WebSocket(STOMP)** 프로토콜 명세서입니다.

---

## 1. 공통 규격 및 정책

### 1.1 기본 정보
- **Base URL**: `https://api.kalvatar.com/api/v1`
- **WebSocket URL**: `wss://api.kalvatar.com/ws-connect`
- **인증 방식**: HTTP Header `Authorization: Bearer <JWT_ACCESS_TOKEN>`
- **Content-Type**: `application/json; charset=UTF-8`

### 1.2 공통 응답 포맷 (Envelope)

#### 성공 응답 (HTTP 200 / 201)
```json
{
  "success": true,
  "data": { ... },
  "message": "성공 메시지 (선택 사항)",
  "timestamp": "2026-10-06T19:00:00Z"
}
```

#### 에러 응답 (HTTP 4xx / 5xx)
```json
{
  "success": false,
  "error": {
    "code": "INVALID_SCHEDULE_FORMAT",
    "message": "일정의 시작 시간이나 장소를 식별할 수 없습니다.",
    "details": null
  },
  "timestamp": "2026-10-06T19:00:00Z"
}
```

---

## 2. 인증 & 사용자 API (Auth & Users)

### 2.1 소셜 로그인 & 토큰 발급
- **Endpoint**: `POST /auth/social-login`
- **설명**: 카카오/애플/구글 소셜 인증 토큰으로 로그인 또는 회원가입 처리

#### Request Body
```json
{
  "provider": "KAKAO",
  "oauthToken": "kakao_oauth_access_token_string",
  "deviceInfo": {
    "osType": "IOS",
    "deviceToken": "fcm_or_apns_token_string"
  }
}
```

#### Response Body (200 OK)
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsIn...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsIn...",
    "expiresIn": 7200,
    "user": {
      "userId": 1001,
      "email": "user@kalvatar.com",
      "nickname": "러닝맨",
      "statusMessage": "오늘도 파이팅!",
      "defaultVisibility": "APPROXIMATE",
      "avatar": {
        "baseAvatarId": "AVATAR_ATHLETE",
        "styleConfig": { "hair": "short_black", "clothes": "sportswear_blue" }
      }
    }
  }
}
```

---

### 2.2 내 프로필 & 아바타 수정
- **Endpoint**: `PATCH /users/me/profile`
- **설명**: 닉네임, 상태메시지, 기본 위치 공개수준 및 절전모드 수정

#### Request Body
```json
{
  "nickname": "민수",
  "statusMessage": "저녁 7시 헬스장 예정!",
  "defaultVisibility": "PRECISE",
  "batterySaveMode": false
}
```

---

### 2.3 안심존 (Safe Zone) 등록 및 조회

#### (1) 안심존 목록 조회
- **Endpoint**: `GET /safe-zones`

#### Response Body (200 OK)
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "우리 집",
      "latitude": 37.5123456,
      "longitude": 127.0456789,
      "radiusMeter": 300,
      "maskingActivity": "REST",
      "isActive": true
    }
  ]
}
```

#### (2) 안심존 등록
- **Endpoint**: `POST /safe-zones`

#### Request Body
```json
{
  "name": "강남 오피스",
  "latitude": 37.498123,
  "longitude": 127.027567,
  "radiusMeter": 200,
  "maskingActivity": "WORK"
}
```

---

## 3. 자연어 일정 & AI 행동 루틴 API (Schedule & Routine)

### 3.1 자연어 일정 AI 파싱 & 루틴 자동 생성 (핵심 API)
- **Endpoint**: `POST /schedules/parse`
- **설명**: 사용자의 자연어 텍스트/음성 전사를 LLM이 구조화 분석하여 일정 정보 및 시간대별 행동 루틴 추천 목록 반환

#### Request Body
```json
{
  "rawText": "월요일, 수요일, 금요일 저녁 7시에 역삼 피트니스에서 1시간 웨이트 운동",
  "userCurrentLat": 37.501234,
  "userCurrentLng": 127.039876
}
```

#### Response Body (200 OK)
```json
{
  "success": true,
  "data": {
    "parsedSchedule": {
      "title": "역삼 피트니스 웨이트 운동",
      "category": "WORKOUT",
      "startTime": "2026-10-07T19:00:00",
      "endTime": "2026-10-07T20:00:00",
      "locationName": "역삼 피트니스",
      "destinationLat": 37.502819,
      "destinationLng": 127.036511,
      "repeatPattern": "MON_WED_FRI",
      "estimatedTransitMinutes": 18
    },
    "suggestedRoutines": [
      {
        "taskType": "PREPARE",
        "instruction": "운동복 및 보충제 챙기기 알림",
        "scheduledAt": "2026-10-07T18:20:00",
        "sortOrder": 1,
        "externalAppAction": "NONE"
      },
      {
        "taskType": "DEPART",
        "instruction": "헬스장으로 출발 알림 (도보 18분)",
        "scheduledAt": "2026-10-07T18:40:00",
        "sortOrder": 2,
        "externalAppAction": "MAPS"
      },
      {
        "taskType": "FOCUS_TIMER",
        "instruction": "운동 시작 & 60분 세트 타이머",
        "scheduledAt": "2026-10-07T19:00:00",
        "sortOrder": 3,
        "externalAppAction": "IN_APP_TIMER"
      },
      {
        "taskType": "CHECKIN",
        "instruction": "운동 완료 기록 & 휴식 상태 전환",
        "scheduledAt": "2026-10-07T20:00:00",
        "sortOrder": 4,
        "externalAppAction": "NONE"
      }
    ]
  }
}
```

---

### 3.2 일정 및 루틴 최종 저장
- **Endpoint**: `POST /schedules`
- **설명**: 사용자가 검토/수정한 일정 및 루틴 확정 등록

#### Request Body
```json
{
  "title": "역삼 피트니스 웨이트 운동",
  "category": "WORKOUT",
  "rawInputText": "월요일, 수요일, 금요일 저녁 7시에 역삼 피트니스에서 1시간 웨이트 운동",
  "startTime": "2026-10-07T19:00:00",
  "endTime": "2026-10-07T20:00:00",
  "locationName": "역삼 피트니스",
  "destinationLat": 37.502819,
  "destinationLng": 127.036511,
  "repeatPattern": "MON_WED_FRI",
  "visibility": "ALL_FRIENDS",
  "routines": [
    {
      "taskType": "PREPARE",
      "instruction": "운동복 챙기기 알림",
      "scheduledAt": "2026-10-07T18:20:00",
      "sortOrder": 1,
      "externalAppAction": "NONE"
    },
    {
      "taskType": "DEPART",
      "instruction": "헬스장 출발 알림",
      "scheduledAt": "2026-10-07T18:40:00",
      "sortOrder": 2,
      "externalAppAction": "MAPS"
    },
    {
      "taskType": "FOCUS_TIMER",
      "instruction": "운동 타이머",
      "scheduledAt": "2026-10-07T19:00:00",
      "sortOrder": 3,
      "externalAppAction": "IN_APP_TIMER"
    }
  ]
}
```

---

### 3.3 홈 지도 화면용: 다음 일정 & 진행 루틴 조회
- **Endpoint**: `GET /schedules/next-routine`
- **설명**: 메인 지도 하단 스냅 바텀시트에 표시할 가장 가까운 다음 일정 1개 및 현재 진행 중인 루틴 단계 조회

#### Response Body (200 OK)
```json
{
  "success": true,
  "data": {
    "scheduleId": 42,
    "title": "역삼 피트니스 웨이트",
    "category": "WORKOUT",
    "startTime": "2026-10-07T19:00:00",
    "locationName": "역삼 피트니스",
    "currentRoutine": {
      "routineId": 105,
      "taskType": "DEPART",
      "instruction": "헬스장 출발 (도보 18분)",
      "scheduledAt": "2026-10-07T18:40:00",
      "minutesRemaining": 35,
      "isCompleted": false,
      "externalAppAction": "MAPS"
    }
  }
}
```

---

### 3.4 루틴 완료 체크인
- **Endpoint**: `PATCH /routines/{routineId}/complete`
- **설명**: 사용자가 알림 팝업이나 바텀시트에서 해당 루틴 체크박스를 완료했을 때 호출

---

## 4. 친구 관리 & 공개 설정 API (Friends)

### 4.1 친구 목록 및 현재 활동 상태 조회
- **Endpoint**: `GET /friends`
- **설명**: 친구 목록 및 각 친구의 현재 실시간 활동/온라인 상태 (지도 뷰 및 친구 탭용)

#### Response Body (200 OK)
```json
{
  "success": true,
  "data": [
    {
      "friendshipId": 12,
      "userId": 1002,
      "nickname": "민수",
      "avatar": { "baseAvatarId": "AVATAR_ATHLETE" },
      "visibilitySetting": "PRECISE",
      "currentActivity": {
        "activityType": "WORKOUT",
        "status": "ACTIVE",
        "startedAt": "2026-10-07T19:02:00",
        "durationMinutes": 32,
        "locationName": "역삼 피트니스"
      },
      "lastLocation": {
        "latitude": 37.502819,
        "longitude": 127.036511,
        "isApproximate": false
      },
      "isOnline": true
    },
    {
      "friendshipId": 13,
      "userId": 1003,
      "nickname": "지현",
      "avatar": { "baseAvatarId": "AVATAR_STUDENT" },
      "visibilitySetting": "APPROXIMATE",
      "currentActivity": {
        "activityType": "CAFE",
        "status": "ACTIVE",
        "durationMinutes": 15,
        "locationName": "강남역 부근"
      },
      "lastLocation": {
        "latitude": 37.498,
        "longitude": 127.028,
        "isApproximate": true
      },
      "isOnline": true
    }
  ]
}
```

---

### 4.2 친구별 위치 공개 수준 변경
- **Endpoint**: `PATCH /friends/{friendshipId}/visibility`

#### Request Body
```json
{
  "visibility": "ACTIVITY_ONLY"
}
```
*(옵션: `DEFAULT`, `PRECISE`, `APPROXIMATE`, `ACTIVITY_ONLY`, `GHOST`)*

---

## 5. 실시간 WebSocket (STOMP) 프로토콜 명세

### 5.1 연결 및 핸드셰이크
- **Connection URL**: `wss://api.kalvatar.com/ws-connect`
- **STOMP Connect Headers**:
  ```http
  Authorization: Bearer <JWT_ACCESS_TOKEN>
  heart-beat: 10000,10000
  ```

---

### 5.2 클라이언트 발신 (Publishing)

#### (1) 내 실시간 위치 보고 (`/pub/location/report`)
- **주기**: 이동 시 10~20초, 정지 시 5분, 화면 보고 있을 때 가속
```json
{
  "latitude": 37.501923,
  "longitude": 127.037142,
  "accuracyMeter": 8.5,
  "motionMode": "WALKING",
  "speedMps": 1.3
}
```
> **서버 처리**:
> 1. 안심존 진입 여부 판별 (안심존이면 좌표 마스킹)
> 2. Redis GEO 최신 좌표 갱신
> 3. 내 위치를 보고 있는 친구들의 채널로 선별 브로드캐스트

#### (2) 친구 활동에 실시간 응원 리액션 전송 (`/pub/reaction/send`)
```json
{
  "targetUserId": 1002,
  "activitySessionId": 501,
  "reactionType": "FIRE"
}
```
*(옵션: `FIRE`, `COFFEE`, `CHEER`, `HEART`)*

---

### 5.3 클라이언트 수신 (Subscribing)

#### (1) 내 친구들의 실시간 좌표 스트림 구독
- **Destination**: `/user/sub/friends/locations`
```json
{
  "userId": 1002,
  "nickname": "민수",
  "latitude": 37.502819,
  "longitude": 127.036511,
  "motionMode": "WALKING",
  "isApproximate": false,
  "timestamp": "2026-10-07T19:04:12Z"
}
```
> **클라이언트 처리**:
> Reanimated 보간 엔진이 이전 좌표에서 새 좌표로 부드럽게 걷는 애니메이션 실행.

#### (2) 나에게 온 실시간 리액션 팝업 구독
- **Destination**: `/user/sub/notifications/reactions`
```json
{
  "senderId": 1003,
  "senderNickname": "지현",
  "reactionType": "FIRE",
  "timestamp": "2026-10-07T19:05:00Z"
}
```
> **클라이언트 처리**:
> 화면 내 내 캐릭터 주변에 불꽃(🔥) 파티클 애니메이션 및 햅틱 진동 발생.
