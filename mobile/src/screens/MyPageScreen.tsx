import React, { useState } from 'react';
import { StyleSheet, View, Text, SafeAreaView, TouchableOpacity, Switch } from 'react-native';

export const MyPageScreen = () => {
  const [batterySaveMode, setBatterySaveMode] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>👤 내 프로필</Text>
      </View>

      <View style={styles.profileCard}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarEmoji}>🏃‍♂️</Text>
        </View>
        <Text style={styles.userName}>러너 민수</Text>
        <Text style={styles.userStatus}>"오늘도 저녁 운동 파이팅!"</Text>

        <TouchableOpacity style={styles.customBtn} onPress={() => alert('캐릭터 커스텀 화면으로 이동합니다.')}>
          <Text style={styles.customBtnText}>🎨 아바타 커스텀</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.settingCard}>
        <Text style={styles.settingHeader}>⚙️ 시스템 및 배터리 설정</Text>

        <View style={styles.settingRow}>
          <View style={styles.settingTextCol}>
            <Text style={styles.settingTitle}>배터리 절전 모드</Text>
            <Text style={styles.settingDesc}>이동 감지 시 위치 갱신 빈도를 줄여 배터리를 절약합니다.</Text>
          </View>
          <Switch
            value={batterySaveMode}
            onValueChange={setBatterySaveMode}
            trackColor={{ false: '#D1D5DB', true: '#4F46E5' }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { padding: 20, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderColor: '#E5E7EB' },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#111827' },
  profileCard: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarEmoji: { fontSize: 40 },
  userName: { fontSize: 18, fontWeight: '700', color: '#111827' },
  userStatus: { fontSize: 13, color: '#6B7280', marginTop: 4, marginBottom: 16 },
  customBtn: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  customBtnText: { fontSize: 13, fontWeight: '600', color: '#374151' },
  settingCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  settingHeader: { fontSize: 15, fontWeight: '700', color: '#111827', marginBottom: 16 },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  settingTextCol: { flex: 1, marginRight: 12 },
  settingTitle: { fontSize: 14, fontWeight: '600', color: '#1F2937' },
  settingDesc: { fontSize: 11, color: '#6B7280', marginTop: 2 },
});
