import React from 'react';
import { StyleSheet, View, Text, SafeAreaView, TouchableOpacity } from 'react-native';

interface LoginScreenProps {
  onLoginSuccess: (user: any) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const handleSocialLogin = (provider: string) => {
    // 소셜 로그인 처리 시뮬레이션
    const mockUser = {
      userId: 1001,
      nickname: '민수',
      provider,
    };
    onLoginSuccess(mockUser);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoBadge}>
          <Text style={styles.logoEmoji}>✨</Text>
        </View>
        <Text style={styles.brandTitle}>Kalvatar</Text>
        <Text style={styles.brandSubtitle}>일정 자동화 & 위치 기반 실시간 캐릭터 소셜</Text>

        <View style={styles.illustrationBox}>
          <Text style={styles.avatarEmoji}>🏃‍♂️  💨  🏋️‍♂️</Text>
          <Text style={styles.quote}>
            "일정을 적으면, 행동이 시작되고{'\n'}지도 위 캐릭터가 함께 움직입니다"
          </Text>
        </View>

        <View style={styles.btnGroup}>
          <TouchableOpacity
            style={[styles.loginBtn, styles.kakaoBtn]}
            onPress={() => handleSocialLogin('KAKAO')}
          >
            <Text style={styles.kakaoBtnText}>🟡 카카오로 시작하기</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.loginBtn, styles.appleBtn]}
            onPress={() => handleSocialLogin('APPLE')}
          >
            <Text style={styles.appleBtnText}> Apple로 시작하기</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.loginBtn, styles.googleBtn]}
            onPress={() => handleSocialLogin('GOOGLE')}
          >
            <Text style={styles.googleBtnText}>🌐 Google로 시작하기</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.privacyNotice}>
          🔒 위치 공유는 내가 설정한 시간과 친구에게만 안전하게 공유됩니다.
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { flex: 1, padding: 24, justifyContent: 'center', alignItems: 'center' },
  logoBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  logoEmoji: { fontSize: 32 },
  brandTitle: { fontSize: 30, fontWeight: '800', color: '#1F2937' },
  brandSubtitle: { fontSize: 13, color: '#6B7280', marginTop: 4, textAlign: 'center' },
  illustrationBox: {
    marginVertical: 40,
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 24,
    borderRadius: 20,
    width: '100%',
  },
  avatarEmoji: { fontSize: 42, marginBottom: 16 },
  quote: { fontSize: 14, color: '#4B5563', textAlign: 'center', lineHeight: 22, fontWeight: '500' },
  btnGroup: { width: '100%', gap: 12 },
  loginBtn: {
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  kakaoBtn: { backgroundColor: '#FEE500' },
  kakaoBtnText: { color: '#000000', fontSize: 15, fontWeight: '700' },
  appleBtn: { backgroundColor: '#000000' },
  appleBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
  googleBtn: { backgroundColor: '#F3F4F6', borderWidth: 1, borderColor: '#E5E7EB' },
  googleBtnText: { color: '#1F2937', fontSize: 15, fontWeight: '600' },
  privacyNotice: {
    fontSize: 11,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 28,
    lineHeight: 16,
  },
});
