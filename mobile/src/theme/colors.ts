export const theme = {
  colors: {
    primary: '#006c49',
    primaryContainer: '#10b981',
    naverGreen: '#03C75A',
    surface: '#F8F9FF',
    surfaceCard: '#FFFFFF',
    surfaceContainerLow: '#EFF4FF',
    surfaceContainer: '#E5EEFF',
    textPrimary: '#0B1C30',
    textSecondary: '#3C4A42',
    textMuted: '#64748B',
    outline: '#6C7A71',
    outlineVariant: '#BBCABF',
    border: '#E2E8F0',
    inverseSurface: '#213145',

    // 활동 상태별 컬러 토큰
    status: {
      exercise: '#10B981', // 운동
      study: '#3B82F6',    // 공부
      cafe: '#F59E0B',     // 카페
      medical: '#EF4444',  // 병원
      transit: '#8B5CF6',  // 이동/출근
      shopping: '#EC4899', // 쇼핑
      home: '#64748B',     // 휴식/집
    },
  },
  shadows: {
    card: {
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 16,
      elevation: 4,
    },
    float: {
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.12,
      shadowRadius: 24,
      elevation: 8,
    },
    bottomSheet: {
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: -8 },
      shadowOpacity: 0.1,
      shadowRadius: 32,
      elevation: 12,
    },
  },
};
