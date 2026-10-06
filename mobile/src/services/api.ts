// API Base URL (로컬 개발 환경: 안드로이드 에뮬레이터 10.0.2.2, iOS 시뮬레이터 localhost)
const BASE_URL = 'http://localhost:8080/api/v1';

export interface ScheduleParsePayload {
  rawText: string;
  userCurrentLat?: number;
  userCurrentLng?: number;
}

export interface LocationReportPayload {
  userId: number;
  latitude: number;
  longitude: number;
  accuracyMeter?: number;
  motionMode: 'STATIONARY' | 'WALKING' | 'DRIVING' | 'TRANSIT';
  speedMps?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const api = {
  // 1. 자연어 일정 AI 파싱 요청
  parseSchedule: async (payload: ScheduleParsePayload) => {
    try {
      const response = await fetch(`${BASE_URL}/schedules/parse`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error('서버 응답 오류');
      const json: ApiResponse<any> = await response.json();
      return json.data;
    } catch (error) {
      console.warn('API 호출 실패 (Fallback 동작):', error);
      return {
        parsedSchedule: {
          title: '역삼 피트니스 웨이트 운동',
          category: 'WORKOUT',
          startTime: new Date().toISOString(),
          endTime: new Date(Date.now() + 3600000).toISOString(),
          locationName: '역삼 피트니스',
          repeatPattern: 'MON_WED_FRI',
        },
        suggestedRoutines: [
          { instruction: '🎒 운동복 챙기기 알림', scheduledAt: '18:20' },
          { instruction: '🚶 출발 알림 (도보 18분)', scheduledAt: '18:40' },
          { instruction: '⏱️ 운동 타이머 시작', scheduledAt: '19:00' },
          { instruction: '✅ 완료 기록 및 휴식 전환', scheduledAt: '20:00' },
        ],
      };
    }
  },

  // 2. 실시간 위치 보고 (안심존 검증 및 브로드캐스트)
  reportLocation: async (payload: LocationReportPayload) => {
    try {
      const response = await fetch(`${BASE_URL}/locations/report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error('위치 보고 오류');
      const json: ApiResponse<any> = await response.json();
      return json.data;
    } catch (error) {
      console.warn('위치 보고 실패 (로컬 시뮬레이션):', error);
      return null;
    }
  },

  // 3. 친구 목록 조회
  getFriends: async (userId: number = 1) => {
    try {
      const response = await fetch(`${BASE_URL}/friends?userId=${userId}`);
      if (!response.ok) throw new Error('친구 목록 조회 오류');
      const json: ApiResponse<any> = await response.json();
      return json.data;
    } catch (error) {
      console.warn('친구 목록 조회 실패:', error);
      return null;
    }
  },

  // 4. 친구별 위치 공개 수준 변경
  updateFriendVisibility: async (friendshipId: number, visibility: string) => {
    try {
      const response = await fetch(`${BASE_URL}/friends/${friendshipId}/visibility`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visibility }),
      });
      if (!response.ok) throw new Error('공개 수준 변경 오류');
      const json: ApiResponse<any> = await response.json();
      return json.data;
    } catch (error) {
      console.warn('공개 수준 변경 실패:', error);
      return null;
    }
  },

  // 5. 다음 루틴 조회
  getNextRoutine: async (userId: number = 1) => {
    try {
      const response = await fetch(`${BASE_URL}/schedules/next-routine?userId=${userId}`);
      if (!response.ok) throw new Error('서버 응답 오류');
      const json: ApiResponse<any> = await response.json();
      return json.data;
    } catch (error) {
      console.warn('다음 루틴 조회 실패:', error);
      return null;
    }
  },
};
