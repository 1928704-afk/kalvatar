import React from 'react';
import { StyleSheet, View, Text, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';

export const CalendarScreen = () => {
  const scheduleItems = [
    {
      id: 1,
      time: '14:00 ~ 15:30',
      title: '💻 팀 스프린트 회의',
      routines: ['[완료] 회의 안건 문서 준비'],
    },
    {
      id: 2,
      time: '19:00 ~ 20:00',
      title: '🏋️ 저녁 헬스 (웨이트)',
      routines: [
        '18:20 🎒 운동복 챙기기 알림',
        '18:40 🚶 출발 [🗺️ 길찾기]',
        '19:00 ⏱️ 타이머 [🎵 음악 재생]',
        '20:00 ✅ 운동 완료 체크인',
      ],
    },
    {
      id: 3,
      time: '21:30 ~ 22:30',
      title: '📚 기술 스터디 공부',
      routines: ['21:30 뽀모도로 타이머 시작'],
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📅 2026년 10월</Text>
        <Text style={styles.headerSubtitle}>오늘의 실행 루틴 타임라인</Text>
      </View>

      <ScrollView style={styles.scroll}>
        {scheduleItems.map((item) => (
          <View key={item.id} style={styles.card}>
            <Text style={styles.cardTime}>{item.time}</Text>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <View style={styles.routineList}>
              {item.routines.map((routine, idx) => (
                <View key={idx} style={styles.routineItem}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.routineText}>{routine}</Text>
                </View>
              ))}
            </View>
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
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTime: { fontSize: 12, fontWeight: '700', color: '#4F46E5', marginBottom: 4 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#1F2937', marginBottom: 12 },
  routineList: { borderLeftWidth: 2, borderColor: '#E5E7EB', paddingLeft: 12 },
  routineItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  bullet: { color: '#9CA3AF', marginRight: 6 },
  routineText: { fontSize: 13, color: '#4B5563' },
});
