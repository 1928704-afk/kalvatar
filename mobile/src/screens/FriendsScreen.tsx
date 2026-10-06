import React, { useState } from 'react';
import { StyleSheet, View, Text, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';

import { api } from '../services/api';

export const FriendsScreen = () => {
  const [friends, setFriends] = useState([
    { id: 1, name: '민수', status: '운동 중 🏋️', visibility: '정확한 위치' },
    { id: 2, name: '지현', status: '카페 ☕', visibility: '대략적인 위치' },
    { id: 3, name: '준호', status: '이동 중 🚗', visibility: '정확한 위치' },
    { id: 4, name: '수진', status: '공부 중 📚', visibility: '활동만 공개' },
  ]);

  const toggleVisibility = async (id: number) => {
    const levels = ['정확한 위치', '대략적인 위치', '활동만 공개', '완전 비공개'];
    const apiCodes: Record<string, string> = {
      '정확한 위치': 'PRECISE',
      '대략적인 위치': 'APPROXIMATE',
      '활동만 공개': 'ACTIVITY_ONLY',
      '완전 비공개': 'GHOST',
    };

    setFriends((prev) =>
      prev.map((f) => {
        if (f.id === id) {
          const nextIdx = (levels.indexOf(f.visibility) + 1) % levels.length;
          const nextLevel = levels[nextIdx];
          // 백엔드 API 비동기 반영
          api.updateFriendVisibility(id, apiCodes[nextLevel]);
          return { ...f, visibility: nextLevel };
        }
        return f;
      })
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>👥 친구 관리 & 프라이버시</Text>
        <Text style={styles.headerSubtitle}>친구별로 위치 공개 범위를 다르게 설정할 수 있습니다.</Text>
      </View>

      <ScrollView style={styles.scroll}>
        <View style={styles.safeZoneBox}>
          <Text style={styles.safeZoneTitle}>🛡️ 내 안심존: 우리 집 (반경 300m)</Text>
          <Text style={styles.safeZoneDesc}>집에 있을 때는 실제 좌표 대신 "집에서 휴식 중"으로 보호됩니다.</Text>
        </View>

        <Text style={styles.listLabel}>친구 목록 ({friends.length})</Text>
        {friends.map((friend) => (
          <View key={friend.id} style={styles.friendRow}>
            <View>
              <Text style={styles.friendName}>{friend.name}</Text>
              <Text style={styles.friendStatus}>{friend.status}</Text>
            </View>
            <TouchableOpacity
              style={styles.visibilityBtn}
              onPress={() => toggleVisibility(friend.id)}
            >
              <Text style={styles.visibilityBtnText}>{friend.visibility} ▾</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { padding: 20, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderColor: '#E5E7EB' },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#111827' },
  headerSubtitle: { fontSize: 13, color: '#6B7280', marginTop: 4 },
  scroll: { padding: 16 },
  safeZoneBox: {
    backgroundColor: '#EEF2FF',
    padding: 16,
    borderRadius: 14,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#4F46E5',
  },
  safeZoneTitle: { fontSize: 14, fontWeight: '700', color: '#312E81', marginBottom: 2 },
  safeZoneDesc: { fontSize: 12, color: '#4338CA' },
  listLabel: { fontSize: 14, fontWeight: '700', color: '#374151', marginBottom: 10 },
  friendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  friendName: { fontSize: 15, fontWeight: '700', color: '#1F2937' },
  friendStatus: { fontSize: 12, color: '#6B7280', marginTop: 2 },
  visibilityBtn: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  visibilityBtnText: { fontSize: 12, fontWeight: '600', color: '#4F46E5' },
});
