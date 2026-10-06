export type VisibilityLevel = 'PRECISE' | 'APPROXIMATE' | 'ACTIVITY_ONLY' | 'GHOST';

export type ActivityType = 'WORKOUT' | 'STUDY' | 'WORK' | 'CAFE' | 'MOVING' | 'REST';

export type MotionMode = 'STATIONARY' | 'WALKING' | 'DRIVING' | 'TRANSIT';

export interface FriendLocation {
  userId: number;
  nickname: string;
  avatarId: string;
  activityType: ActivityType;
  motionMode: MotionMode;
  latitude: number;
  longitude: number;
  isApproximate: boolean;
  activityDurationMinutes: number;
  locationName?: string;
}

export interface RoutineTask {
  id: number;
  taskType: 'PREPARE' | 'DEPART' | 'FOCUS_TIMER' | 'CHECKIN' | 'CUSTOM';
  instruction: string;
  scheduledAt: string;
  isCompleted: boolean;
  externalAppAction: 'MAPS' | 'MUSIC' | 'IN_APP_TIMER' | 'NONE';
}

export interface NextSchedule {
  id: number;
  title: string;
  category: string;
  startTime: string;
  locationName: string;
  currentRoutine?: RoutineTask;
}
