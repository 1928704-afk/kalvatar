import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Modal,
  TextInput,
} from 'react-native';
import { api } from '../services/api';
import { FriendLocation, NextSchedule } from '../types';

export const MapScreen = () => {
  // Mock 친구 목록 (지도 위 캐릭터)
  const [friends] = useState<FriendLocation[]>([
    {
      userId: 1002,
      nickname: '민수',
      avatarId: 'AVATAR_ATHLETE',
      activityType: 'WORKOUT',
      motionMode: 'STATIONARY',
      latitude: 37.5028,
      longitude: 127.0365,
      isApproximate: false,
      activityDurationMinutes: 32,
      locationName: '역삼 피트니스',
    },
    {
      userId: 1003,
      nickname: '지현',
      avatarId: 'AVATAR_STUDENT',
      activityType: 'CAFE',
      motionMode: 'STATIONARY',
      latitude: 37.4981,
      longitude: 127.0275,
      isApproximate: true,
      activityDurationMinutes: 15,
      locationName: '강남역 부근',
    },
    {
      userId: 1004,
      nickname: '준호',
      avatarId: 'AVATAR_BIZ',
      activityType: 'MOVING',
      motionMode: 'DRIVING',
      latitude: 37.5112,
      longitude: 127.0421,
      isApproximate: false,
      activityDurationMinutes: 8,
      locationName: '테헤란로 이동 중',
    },
  ]);

  // 선택된 친구 상세 팝업 (SCR-04)
  const [selectedFriend, setSelectedFriend] = useState<FriendLocation | null>(null);

  // 자연어 일정 등록 모달 상태 (SCR-03)
  const [isInputModalVisible, setIsInputModalVisible] = useState(false);
  const [naturalText, setNaturalText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // 내 다음 일정 (SCR-02 하단 바텀시트)
  const nextSchedule: NextSchedule = {
    id: 1,
    title: '저녁 웨이트 헬스',
    category: '운동',
    startTime: '19:00',
    locationName: '역삼 피트니스',
    currentRoutine: {
      id: 101,
      taskType: 'DEPART',
      instruction: '출발 알림: 헬스장까지 도보 18분 소요',
      scheduledAt: '18:40',
      isCompleted: false,
      externalAppAction: 'MAPS',
    },
  };

  const handleSendReaction = (emoji: string) => {
    alert(`${selectedFriend?.nickname}님에게 ${emoji} 응원을 보냈습니다!`);
    setSelectedFriend(null);
  };

  const handleAnalyzeSchedule = async () => {
    if (!naturalText.trim()) return;
    setIsAnalyzing(true);
    try {
      const result = await api.parseSchedule({ rawText: naturalText });
      setIsAnalyzing(false);
      const routinesStr = result.suggestedRoutines
        ? result.suggestedRoutines.map((r: any) => `• ${r.instruction}`).join('\n')
        : '루틴 4개 자동 생성';
      alert(`[AI 분석 완료]\n제목: ${result.parsedSchedule.title}\n카테고리: ${result.parsedSchedule.category}\n\n[자동 생성된 루틴]\n${routinesStr}`);
      setNaturalText('');
      setIsInputModalVisible(false);
    } catch (e) {
      setIsAnalyzing(false);
      alert('일정 분석 중 오류가 발생했습니다.');
    }
  };

  const getActivityIcon = (type: string, motion: string) => {
    if (type === 'MOVING') {
      return motion === 'DRIVING' ? '🚗' : '🚶';
    }
    switch (type) {
      case 'WORKOUT': return '🏋️';
      case 'CAFE': return '☕';
      case 'STUDY': return '📚';
      case 'WORK': return '💻';
      default: return '🏠';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 1. 상단 플로팅 헤더 */}
      <View style={styles.topHeader}>
        <View style={styles.profileChip}>
          <Text style={styles.profileEmoji}>🙋</Text>
          <Text style={styles.profileText}>내 상태: 🏠 휴식 중</Text>
        </View>
        <TouchableOpacity style={styles.headerBtn}>
          <Text style={styles.headerBtnText}>🔔</Text>
        </TouchableOpacity>
      </View>

      {/* 2. 지도 시뮬레이션 캔버스 */}
      <View style={styles.mapCanvas}>
        <View style={styles.mapGridNotice}>
          <Text style={styles.mapNoticeTitle}>🗺️ Kalvatar 실시간 캐릭터 지도</Text>
          <Text style={styles.mapNoticeDesc}>친구들의 현재 위치와 활동이 실시간 아바타로 표시됩니다</Text>
        </View>

        {/* 친구 캐릭터 마커들 */}
        {friends.map((friend) => (
          <TouchableOpacity
            key={friend.userId}
            style={styles.characterPin}
            onPress={() => setSelectedFriend(friend)}
          >
            <View style={styles.speechBubble}>
              <Text style={styles.speechText}>
                {getActivityIcon(friend.activityType, friend.motionMode)} {friend.nickname}
              </Text>
            </View>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarEmoji}>
                {friend.activityType === 'WORKOUT' ? '🏋️‍♂️' : friend.activityType === 'CAFE' ? '☕' : '🚗'}
              </Text>
            </View>
            {friend.isApproximate && (
              <View style={styles.approxBadge}>
                <Text style={styles.approxBadgeText}>대략</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}

        {/* FAB: 자연어 일정 추가 (+) */}
        <TouchableOpacity
          style={styles.fabButton}
          onPress={() => setIsInputModalVisible(true)}
        >
          <Text style={styles.fabText}>✨ + 일정 추가</Text>
        </TouchableOpacity>
      </View>

      {/* 3. 하단 스냅 바텀시트: 나의 다음 일정 & 루틴 */}
      <View style={styles.bottomSheet}>
        <View style={styles.sheetHandle} />
        <View style={styles.scheduleRow}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryBadgeText}>다음 일정</Text>
          </View>
          <Text style={styles.scheduleTime}>오늘 {nextSchedule.startTime}</Text>
        </View>
        <Text style={styles.scheduleTitle}>{nextSchedule.title} @ {nextSchedule.locationName}</Text>

        {nextSchedule.currentRoutine && (
          <View style={styles.routineBox}>
            <Text style={styles.routineTime}>⚡ {nextSchedule.currentRoutine.scheduledAt}</Text>
            <Text style={styles.routineDesc}>{nextSchedule.currentRoutine.instruction}</Text>
            <TouchableOpacity style={styles.routineActionBtn}>
              <Text style={styles.routineActionText}>🗺️ 길찾기</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* 4. 친구 활동 상세 모달 (SCR-04) */}
      <Modal visible={!!selectedFriend} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.friendSheet}>
            <View style={styles.sheetHandle} />
            <Text style={styles.friendTitle}>
              {getActivityIcon(selectedFriend?.activityType || '', selectedFriend?.motionMode || '')} {selectedFriend?.nickname}
            </Text>
            <Text style={styles.friendDetail}>
              {selectedFriend?.locationName} • {selectedFriend?.activityDurationMinutes}분째 진행 중
            </Text>

            <View style={styles.reactionSection}>
              <Text style={styles.reactionLabel}>실시간 응원 보내기</Text>
              <View style={styles.reactionRow}>
                {['🔥 득근!', '💪 힘내', '☕ 커피', '❤️ 최고'].map((emoji) => (
                  <TouchableOpacity
                    key={emoji}
                    style={styles.reactionBtn}
                    onPress={() => handleSendReaction(emoji)}
                  >
                    <Text style={styles.reactionBtnText}>{emoji}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setSelectedFriend(null)}
            >
              <Text style={styles.closeBtnText}>닫기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 5. 자연어 일정 등록 모달 (SCR-03) */}
      <Modal visible={isInputModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.inputModalSheet}>
            <Text style={styles.modalHeaderTitle}>✨ AI 자연어 일정 등록</Text>
            <Text style={styles.modalSubtitle}>말하듯 편하게 일정을 입력하면 AI가 행동 루틴을 생성합니다.</Text>

            <TextInput
              style={styles.textInput}
              placeholder="예: 월, 수, 금 저녁 7시에 역삼 피트니스에서 1시간 운동"
              placeholderTextColor="#999"
              multiline
              value={naturalText}
              onChangeText={setNaturalText}
            />

            <View style={styles.inputBtnRow}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setIsInputModalVisible(false)}
              >
                <Text style={styles.cancelBtnText}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.submitBtn}
                onPress={handleAnalyzeSchedule}
                disabled={isAnalyzing}
              >
                <Text style={styles.submitBtnText}>
                  {isAnalyzing ? 'AI 분석 중...' : '✨ AI 분석 및 루틴 생성'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  topHeader: {
    position: 'absolute',
    top: 50,
    left: 16,
    right: 16,
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  profileEmoji: { fontSize: 16, marginRight: 6 },
  profileText: { fontSize: 13, fontWeight: '600', color: '#1F2937' },
  headerBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  headerBtnText: { fontSize: 18 },
  mapCanvas: {
    flex: 1,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapGridNotice: {
    position: 'absolute',
    top: 110,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  mapNoticeTitle: { fontSize: 13, fontWeight: '700', color: '#374151' },
  mapNoticeDesc: { fontSize: 11, color: '#6B7280', marginTop: 2 },
  characterPin: {
    marginVertical: 18,
    alignItems: 'center',
  },
  speechBubble: {
    backgroundColor: '#1F2937',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    marginBottom: 4,
  },
  speechText: { color: '#FFFFFF', fontSize: 12, fontWeight: '600' },
  avatarCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#FFFFFF',
    borderWidth: 3,
    borderColor: '#4F46E5',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 4,
  },
  avatarEmoji: { fontSize: 26 },
  approxBadge: {
    position: 'absolute',
    bottom: -4,
    backgroundColor: '#F59E0B',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 8,
  },
  approxBadgeText: { color: '#FFF', fontSize: 9, fontWeight: '700' },
  fabButton: {
    position: 'absolute',
    right: 20,
    bottom: 180,
    backgroundColor: '#4F46E5',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 28,
    shadowColor: '#4F46E5',
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
  },
  fabText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 28,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 8,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#D1D5DB',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 12,
  },
  scheduleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  categoryBadge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginRight: 8,
  },
  categoryBadgeText: { color: '#4F46E5', fontSize: 11, fontWeight: '700' },
  scheduleTime: { fontSize: 12, color: '#6B7280', fontWeight: '500' },
  scheduleTitle: { fontSize: 17, fontWeight: '700', color: '#111827', marginBottom: 10 },
  routineBox: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#4F46E5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  routineTime: { fontSize: 12, fontWeight: '700', color: '#4F46E5' },
  routineDesc: { flex: 1, fontSize: 12, color: '#374151', marginHorizontal: 8 },
  routineActionBtn: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  routineActionText: { fontSize: 11, fontWeight: '600', color: '#1F2937' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  friendSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
  },
  friendTitle: { fontSize: 20, fontWeight: '700', color: '#111827', marginBottom: 4 },
  friendDetail: { fontSize: 13, color: '#6B7280', marginBottom: 20 },
  reactionSection: { marginBottom: 20 },
  reactionLabel: { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 10 },
  reactionRow: { flexDirection: 'row', justifyContent: 'space-between' },
  reactionBtn: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 16,
  },
  reactionBtnText: { fontSize: 13, fontWeight: '600' },
  closeBtn: {
    backgroundColor: '#E5E7EB',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  closeBtnText: { fontSize: 14, fontWeight: '600', color: '#374151' },
  inputModalSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
  },
  modalHeaderTitle: { fontSize: 18, fontWeight: '700', color: '#111827', marginBottom: 4 },
  modalSubtitle: { fontSize: 12, color: '#6B7280', marginBottom: 16 },
  textInput: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 14,
    fontSize: 14,
    minHeight: 90,
    textAlignVertical: 'top',
    color: '#111827',
    marginBottom: 20,
  },
  inputBtnRow: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10 },
  cancelBtn: { paddingVertical: 12, paddingHorizontal: 18, borderRadius: 12 },
  cancelBtnText: { fontSize: 14, color: '#6B7280', fontWeight: '600' },
  submitBtn: {
    backgroundColor: '#4F46E5',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  submitBtnText: { color: '#FFF', fontSize: 14, fontWeight: '700' },
});
