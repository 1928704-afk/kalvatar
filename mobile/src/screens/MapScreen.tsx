import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
  ImageBackground,
  TextInput,
  Modal,
} from 'react-native';
import { theme } from '../theme/colors';
import { api } from '../services/api';

// 친구 인터페이스
interface FriendPin {
  id: number;
  name: string;
  statusText: string;
  emoji: string;
  location: string;
  category: 'exercise' | 'study' | 'medical' | 'cafe' | 'transit' | 'shopping' | 'home';
  avatarUrl: string;
  top: number;
  left?: number;
  right?: number;
}

export const MapScreen = () => {
  // 6개 지도 핀 데이터
  const [friends] = useState<FriendPin[]>([
    {
      id: 1,
      name: '지민',
      statusText: '운동 중',
      emoji: '💪',
      location: '잠실한강공원',
      category: 'exercise',
      avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCnodaroM-myxep_hIqaMmnjiuIzReGtzn_VBv_h1f1R6sDv9Uu8DYOS59M6kq8l1jItwQqo76TPQGHIzg_QcGSFuyDqIGRjZwwgJzZ_BTa0CT9U3gf5I6HyHV4nwSLtJlkuyyETAXQ5PU5UFBRC2RGApwg-D-KhTaQRlJLxYwHm1b5slefAIeLtjYNicHUm9WD71TGqMPEqQKkIEw1sJgNnah-IFFTC_0T8y1i9E-svUrHzv4sDbRBjxqK89Lq9PjJcqGToZrgnSaONC0',
      top: 10,
      left: 70,
    },
    {
      id: 2,
      name: '서연',
      statusText: '공부 중',
      emoji: '💻',
      location: '롯데월드타워 근처',
      category: 'study',
      avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBmV0IIdI0As77HXzBTm31y2L0BcBv-AgM-cTjI1-deb4TQaxiaQ6ISpMhOQx5IXzIqKxx-5iVI_XymN3gBo53oPRH2s6k8dNdhSJSuqYbuR8T8r7r3A4yQyGpqngxXLEdb1gHdvvywzY7mntVCBTte8y_FbyibPW-5GMtXLEFTyGK6a5YaALQtfw96AEvIBKjO43HT-ojFf04b9_oKlJAAAS_Bu8iw2s0IWMAxDXSesaYj7tMH7O3JzwkRlASZD0vUnoet8nYmk_4x9bc',
      top: 50,
      right: 20,
    },
    {
      id: 3,
      name: '민수',
      statusText: '병원에 있음',
      emoji: '🏥',
      location: '삼성서울병원',
      category: 'medical',
      avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCFSk8jCSRN2OueRafM7SGsgQd36Su3Hx-JVOod0Qs5q9qcBj7b9S-Ea4mxnpsXCFxyN3UYYEAlJ55LTJnuJ_pgxwn9jrhcA70sNee_wgDAcoBjMxIwsp7xubebURVoiNIevr-Ynfgt-aHz1DwPwNnKT-1Ut4xJSffi-Jboz0NeWMm7faoPzwvI-uO6AEzzqO3C9CQB_Pkfw50-22RS0GSAPtJuaMmgYgkj-6N3tM7YKCAuF9gm8sFbRg',
      top: 155,
      left: 18,
    },
    {
      id: 4,
      name: '하은',
      statusText: '카페에서 휴식',
      emoji: '☕',
      location: '석촌호수 카페거리',
      category: 'cafe',
      avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCQJpbYYx5jYaBC-AvUxABxWb8ZeDYvvXGZ9smnvRTbJ6t8cEl_yMqQS1K-C4XTh3F--wicVRQ9l2kktSFu1Hk53Aw6URBKDMuPGQOXZgNT8Wqws9CMXXRCFdlmBekzb_WWz1beMp-ZrXrOx1aLW6ryar2d8Th7HZxzwJiTD-TiSIZqUQCFFsgOW7QdNPBVM2oa-iERXGzN4cdNBL_6mm3vtG3ds6-6QqnSNavBw5SQX372cduDNR5o9Yc8SA2TcuNYHWrIxHTGr2PQP9k',
      top: 180,
      right: 80,
    },
    {
      id: 5,
      name: '도현',
      statusText: '회사 가는 중',
      emoji: '💼',
      location: '잠실역 방향',
      category: 'transit',
      avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCXwYlY0xSZtYdcCA3uXk45g-YBrmjDt4WOS8-OjVnOGlnhLTZGe0aM3GvoQOQcjCeeHt_3jCchtmm6vy1p4V9n2aBThDMYRZUNc9DZOgjVL2xHv5xd6OVY8OiWgQQgi4bZZcqHkuv75lZPgvA7hcUxyjDyHeBFetH14i9EKvZI16PyVtFoC0u2IoNYkw429tEU570AP5BstoT9bpFa67dh2xsEfRBUIt-UJ7coIMbWk4wcXs847saHv4UVpHrJAsnteOpoyAQZdO3sC1o',
      top: 265,
      right: 25,
    },
    {
      id: 6,
      name: '지우',
      statusText: '쇼핑 중',
      emoji: '🛍️',
      location: '가로수길',
      category: 'shopping',
      avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBUJT635X2UxtcQKMcgMdJsts2x0K6J8ED4rT3gtUPoAy3wUKUWv_KOJYIP31HgO-OIcayAbI9sOvGnAoleirBuvNZ-jM7QmsUmqkLU5Lspaq1Xjn4OpXopvd_dkF8M53lOgs4T2MmP1Bx5L5a5Buq58yvPVlxws7yt5tIkwHPKBHlOSvbprPlW40AOGdEdIdBnDIRURXq-a4ZVOZCfc2OAMkJDI0gH-6xIP23b2XcBhd0zDvmoEMxNgA',
      top: 280,
      left: 20,
    },
  ]);

  // 하단 캐러셀 전체 친구 7명
  const allFriendsList = [
    ...friends,
    {
      id: 7,
      name: '현우',
      statusText: '집에서 휴식',
      emoji: '🏠',
      location: '역삼동',
      category: 'home' as const,
      avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDaMEHWlNV4EpsloElZ6QTFr2KA32hjKug423fJb4AFEOTJN7EhyfZL0tVwDX5JglWouKaPdM3UZJlT1cZGEE2z4MGybnLEq3n__gJRJT2zAaAsYet2ViXdGCqjuR4P4Sx9hQLQF7frEdHSV2WOFRZ_uF8NGMRpILwZDvntMvT7Iq7y_IVZVX7S5LlJTG42iUeNhsuX3B1dofxrzzxNS1FrIhkJRpMXbxe1-s9bwmZmT7N9JJnn1qS9OA',
      top: 0,
    },
  ];

  // 선택된 친구 상세 팝업 상태
  const [selectedFriend, setSelectedFriend] = useState<FriendPin | null>(null);

  // 자연어 일정 등록 모달 상태
  const [isInputModalVisible, setIsInputModalVisible] = useState(false);
  const [naturalText, setNaturalText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // 카테고리 필터 선택
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'exercise': return theme.colors.status.exercise;
      case 'study': return theme.colors.status.study;
      case 'medical': return theme.colors.status.medical;
      case 'cafe': return theme.colors.status.cafe;
      case 'transit': return theme.colors.status.transit;
      case 'shopping': return theme.colors.status.shopping;
      case 'home': return theme.colors.status.home;
      default: return theme.colors.primary;
    }
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'exercise': return '🏋️';
      case 'study': return '📚';
      case 'medical': return '🏥';
      case 'cafe': return '☕';
      case 'transit': return '💼';
      case 'shopping': return '🛍️';
      case 'home': return '🏠';
      default: return '📍';
    }
  };

  const handleSendReaction = (emoji: string) => {
    alert(`${selectedFriend?.name}님에게 ${emoji} 응원을 보냈습니다!`);
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

  return (
    <SafeAreaView style={styles.container}>
      {/* 1. 고정 상단 네비게이션 헤더 */}
      <View style={styles.topNavHeader}>
        <View style={styles.navLeft}>
          <View style={styles.compassCircle}>
            <Text style={{ fontSize: 18 }}>🧭</Text>
          </View>
          <Text style={styles.navTitle}>Map</Text>
        </View>
        <View style={styles.navRight}>
          <TouchableOpacity style={styles.iconBtn}>
            <Text style={{ fontSize: 18 }}>🔔</Text>
          </TouchableOpacity>
          <View style={styles.myAvatarMini}>
            <Text style={{ fontSize: 16 }}>👤</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.mainScroll} bounces={false}>
        {/* 2. 플로팅 통합 검색 바 & 카테고리 필터 칩 */}
        <View style={styles.searchSection}>
          <View style={styles.searchBar}>
            <View style={styles.searchLeft}>
              <Text style={styles.naverN}>N</Text>
              <TextInput
                style={styles.searchInput}
                placeholder="장소, 버스, 지하철, 주소 검색"
                placeholderTextColor={theme.colors.outline}
              />
            </View>
            <View style={styles.searchRight}>
              <TouchableOpacity style={styles.searchActionBtn}>
                <Text style={{ fontSize: 18, color: theme.colors.naverGreen }}>🎙️</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.searchActionBtn}>
                <Text style={{ fontSize: 18 }}>🔔</Text>
                <View style={styles.pinkDot} />
              </TouchableOpacity>
              <View style={styles.profileThumb}>
                <Image
                  source={{
                    uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCB2wd2r-8wgN3iyPNNjvicMJn1-hU9jKl8w5Rgz-dVdXePROI5ZBNZodxIFbd6XfPs1vUV6pMJIq6LA8dmJ6JcQ077JxVFIozP85_PfeXXzThiYIW1WyCyO6sey5WwrwSTAb89xwaAAoNSK-FK3oSf7y8QOkVSQUaSEHidEi5ZS_2ROw3tpraOkvmNM9uS33ISspZl1p3dhPThWhZacMwX4CV31IhrT-X0FJXW_l9C7_BqtPP6hoXz2g',
                  }}
                  style={styles.profileThumbImg}
                />
              </View>
            </View>
          </View>

          {/* 카테고리 알약 필터 가로 스크롤 */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryPillsRow}
          >
            {[
              { label: '음식점', emoji: '🍽️', color: theme.colors.status.cafe },
              { label: '카페', emoji: '☕', color: theme.colors.status.cafe },
              { label: '운동', emoji: '🏋️', color: theme.colors.status.exercise },
              { label: '공부', emoji: '📚', color: theme.colors.status.study },
              { label: '병원', emoji: '➕', color: theme.colors.status.medical },
              { label: '쇼핑', emoji: '🛍️', color: theme.colors.status.shopping },
              { label: '더보기', emoji: '•••', color: theme.colors.textMuted },
            ].map((cat, i) => (
              <TouchableOpacity key={i} style={styles.categoryPill}>
                <Text style={{ fontSize: 14 }}>{cat.emoji}</Text>
                <Text style={styles.categoryPillText}>{cat.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* 3. 지도 캔버스 (Map Canvas) */}
        <View style={styles.mapContainer}>
          <ImageBackground
            source={{
              uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDyMUr1hvq2nzwbx0hX7ygH5JjUQl9vrZxXhv1rUDCz_2mjW_v_wFsPvlLUUpj9xOWzKQbFGOR2WTJp4eAQGjRz2_CzmXx0z4fnG-nQ5aXUnH-9I0oX7n3CFLngnMvGglzS77y4L_goR5_bpxCM1_gW7HvgejkIGJYPQQNcBksuYs7jXlKCYb-SALrIP_3-2uvDMHHGk49Yo2BSNAV51nv-t6NT6WopYk8tLUdImMEJuee8p9uojLo2MA',
            }}
            style={styles.mapBg}
            resizeMode="cover"
          >
            {/* 우측 상단 플로팅 컨트롤 (레이어, 길찾기, 내 위치) */}
            <View style={styles.floatingControls}>
              <TouchableOpacity style={styles.mapControlBtn}>
                <Text style={{ fontSize: 18 }}>🗂️</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.mapControlBtn}>
                <Text style={{ fontSize: 18 }}>🧭</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.mapControlBtn}>
                <Text style={{ fontSize: 18, color: theme.colors.naverGreen }}>🎯</Text>
              </TouchableOpacity>
            </View>

            {/* 지도 위 친구 캐릭터 핀 6종 */}
            {friends.map((friend) => (
              <TouchableOpacity
                key={friend.id}
                style={[
                  styles.mapPinContainer,
                  {
                    top: friend.top,
                    left: friend.left,
                    right: friend.right,
                  },
                ]}
                activeOpacity={0.9}
                onPress={() => setSelectedFriend(friend)}
              >
                {/* 1) 상단 둥근 말풍선 카드 */}
                <View style={styles.speechCard}>
                  <View
                    style={[
                      styles.speechIconBox,
                      { backgroundColor: getCategoryColor(friend.category) },
                    ]}
                  >
                    <Text style={{ fontSize: 13, color: '#FFF' }}>
                      {getCategoryIcon(friend.category)}
                    </Text>
                  </View>
                  <View style={styles.speechTextCol}>
                    <View style={styles.speechTitleRow}>
                      <Text style={styles.speechName}>{friend.name}</Text>
                      <Text style={styles.speechStatus}>
                        {friend.statusText} {friend.emoji}
                      </Text>
                    </View>
                    <Text style={styles.speechLocation} numberOfLines={1}>
                      {friend.location}
                    </Text>
                  </View>
                </View>

                {/* 2) 말풍선 뾰족 꼬리 */}
                <View style={styles.speechTriangle} />

                {/* 3) 치비 캐릭터 일러스트 */}
                <View style={styles.chibiAvatarWrapper}>
                  <Image source={{ uri: friend.avatarUrl }} style={styles.chibiAvatarImg} />
                  {/* 발 밑 컬러 앵커 도트 */}
                  <View
                    style={[
                      styles.avatarAnchorDot,
                      { backgroundColor: getCategoryColor(friend.category) },
                    ]}
                  />
                </View>
              </TouchableOpacity>
            ))}

            {/* 좌측 하단 NAVER 워터마크 */}
            <View style={styles.naverWatermark}>
              <Text style={styles.naverWatermarkText}>NAVER</Text>
            </View>

            {/* 우측 하단: 자연어 일정 등록 FAB 버튼 */}
            <TouchableOpacity
              style={styles.addScheduleFab}
              onPress={() => setIsInputModalVisible(true)}
            >
              <Text style={styles.addScheduleFabText}>✨ + 일정 추가</Text>
            </TouchableOpacity>
          </ImageBackground>
        </View>

        {/* 4. 하단 프렌즈 드로어 시트 (Active Friends & Routine Tracker) */}
        <View style={styles.bottomDrawerSheet}>
          {/* 드로어 핸들 */}
          <View style={styles.drawerHandle} />

          {/* 시트 헤더: 친구들 7 > | 지금 함께하는 친구 3 (아바타 스택) */}
          <View style={styles.drawerHeaderRow}>
            <TouchableOpacity style={styles.friendsCountBtn}>
              <Text style={styles.drawerTitleText}>친구들</Text>
              <Text style={styles.drawerTitleCount}>7</Text>
              <Text style={styles.drawerArrow}>›</Text>
            </TouchableOpacity>

            <View style={styles.togetherGroupChip}>
              <Text style={styles.togetherText}>지금 함께하는 친구</Text>
              <Text style={styles.togetherCount}>3</Text>
              <View style={styles.avatarStack}>
                <Image source={{ uri: allFriendsList[0].avatarUrl }} style={[styles.stackImg, { zIndex: 3 }]} />
                <Image source={{ uri: allFriendsList[1].avatarUrl }} style={[styles.stackImg, { marginLeft: -8, zIndex: 2 }]} />
                <Image source={{ uri: allFriendsList[3].avatarUrl }} style={[styles.stackImg, { marginLeft: -8, zIndex: 1 }]} />
              </View>
              <Text style={styles.drawerArrowMini}>›</Text>
            </View>
          </View>

          {/* 상태 태그 필터 캐러셀 */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.statusTagsRow}>
            <TouchableOpacity
              style={[styles.statusTagPill, selectedCategory === 'all' && styles.statusTagPillActive]}
              onPress={() => setSelectedCategory('all')}
            >
              <Text style={[styles.statusTagText, selectedCategory === 'all' && styles.statusTagTextActive]}>
                전체
              </Text>
            </TouchableOpacity>

            {[
              { id: 'exercise', label: '운동', count: 2, icon: '🏋️', color: theme.colors.status.exercise },
              { id: 'study', label: '공부', count: 1, icon: '📚', color: theme.colors.status.study },
              { id: 'medical', label: '병원', count: 1, icon: '🏥', color: theme.colors.status.medical },
              { id: 'cafe', label: '카페', count: 1, icon: '☕', color: theme.colors.status.cafe },
              { id: 'shopping', label: '쇼핑', count: 1, icon: '🛍️', color: theme.colors.status.shopping },
            ].map((tag) => (
              <TouchableOpacity
                key={tag.id}
                style={[
                  styles.statusTagPill,
                  selectedCategory === tag.id && styles.statusTagPillActive,
                ]}
                onPress={() => setSelectedCategory(tag.id)}
              >
                <Text style={{ fontSize: 13 }}>{tag.icon}</Text>
                <Text
                  style={[
                    styles.statusTagText,
                    selectedCategory === tag.id && styles.statusTagTextActive,
                  ]}
                >
                  {tag.label}
                </Text>
                <Text style={styles.statusTagCount}>{tag.count}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* 7인 친구 가로 스크롤 카드 리스트 */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.friendsCardScroll}
          >
            {allFriendsList.map((friend) => (
              <TouchableOpacity
                key={friend.id}
                style={styles.friendCardItem}
                activeOpacity={0.8}
                onPress={() => setSelectedFriend(friend)}
              >
                <View style={styles.friendCardAvatarBox}>
                  <Image source={{ uri: friend.avatarUrl }} style={styles.friendCardAvatarImg} />
                  <View
                    style={[
                      styles.friendCardBadge,
                      { backgroundColor: getCategoryColor(friend.category) },
                    ]}
                  >
                    <Text style={{ fontSize: 10 }}>{getCategoryIcon(friend.category)}</Text>
                  </View>
                </View>

                <View style={styles.friendCardNameRow}>
                  <View
                    style={[
                      styles.statusDot,
                      { backgroundColor: getCategoryColor(friend.category) },
                    ]}
                  />
                  <Text style={styles.friendCardName}>{friend.name}</Text>
                </View>

                <Text style={styles.friendCardStatus} numberOfLines={1}>
                  {friend.statusText}
                </Text>
                <Text style={styles.friendCardLocation} numberOfLines={1}>
                  {friend.location}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </ScrollView>

      {/* 5. 친구 활동 상세 & 실시간 응원 리액션 모달 (SCR-04) */}
      <Modal visible={!!selectedFriend} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.friendSheet}>
            <View style={styles.drawerHandle} />
            <View style={styles.modalHeaderInfo}>
              <Image source={{ uri: selectedFriend?.avatarUrl }} style={styles.modalAvatarLarge} />
              <View>
                <Text style={styles.modalFriendName}>
                  {selectedFriend?.name} {selectedFriend?.emoji}
                </Text>
                <Text style={styles.modalFriendDetail}>
                  {selectedFriend?.statusText} • {selectedFriend?.location}
                </Text>
              </View>
            </View>

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

            <TouchableOpacity style={styles.closeBtn} onPress={() => setSelectedFriend(null)}>
              <Text style={styles.closeBtnText}>닫기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 6. 자연어 일정 등록 모달 (SCR-03) */}
      <Modal visible={isInputModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.inputModalSheet}>
            <Text style={styles.modalHeaderTitle}>✨ AI 자연어 일정 등록</Text>
            <Text style={styles.modalSubtitle}>
              말하듯 편하게 일정을 입력하면 AI가 행동 루틴을 생성합니다.
            </Text>

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
    backgroundColor: theme.colors.surface,
  },
  topNavHeader: {
    height: 52,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(248, 249, 255, 0.95)',
    zIndex: 40,
  },
  navLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  compassCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 108, 73, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    letterSpacing: -0.3,
  },
  navRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  myAvatarMini: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainScroll: {
    flex: 1,
  },
  searchSection: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 8,
    zIndex: 30,
  },
  searchBar: {
    height: 52,
    backgroundColor: theme.colors.surfaceCard,
    borderRadius: 26,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 4,
  },
  searchLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 10,
  },
  naverN: {
    fontSize: 22,
    fontWeight: '900',
    color: theme.colors.naverGreen,
    letterSpacing: -1,
  },
  searchInput: {
    fontSize: 14,
    color: theme.colors.textPrimary,
    flex: 1,
  },
  searchRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  searchActionBtn: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pinkDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.status.shopping,
    borderWidth: 1.5,
    borderColor: '#FFF',
  },
  profileThumb: {
    width: 34,
    height: 34,
    borderRadius: 17,
    overflow: 'hidden',
    backgroundColor: '#E5EEFF',
  },
  profileThumbImg: {
    width: '100%',
    height: '100%',
  },
  categoryPillsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 10,
    paddingBottom: 4,
  },
  categoryPill: {
    height: 36,
    paddingHorizontal: 14,
    borderRadius: 18,
    backgroundColor: theme.colors.surfaceCard,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  categoryPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  mapContainer: {
    width: '100%',
    height: 520,
    overflow: 'hidden',
  },
  mapBg: {
    width: '100%',
    height: '100%',
  },
  floatingControls: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 20,
    gap: 10,
  },
  mapControlBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.surfaceCard,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 4,
  },
  mapPinContainer: {
    position: 'absolute',
    alignItems: 'center',
    zIndex: 10,
  },
  speechCard: {
    backgroundColor: theme.colors.surfaceCard,
    borderRadius: 18,
    paddingVertical: 7,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.14,
    shadowRadius: 16,
    elevation: 4,
  },
  speechIconBox: {
    width: 30,
    height: 30,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  speechTextCol: {
    justifyContent: 'center',
  },
  speechTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  speechName: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  speechStatus: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  speechLocation: {
    fontSize: 10,
    color: theme.colors.textMuted,
    marginTop: 1,
  },
  speechTriangle: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 7,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: theme.colors.surfaceCard,
    marginTop: -1,
  },
  chibiAvatarWrapper: {
    alignItems: 'center',
    marginTop: 2,
  },
  chibiAvatarImg: {
    width: 58,
    height: 58,
    resizeMode: 'contain',
  },
  avatarAnchorDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#FFF',
    marginTop: -8,
    zIndex: 2,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  naverWatermark: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    opacity: 0.85,
  },
  naverWatermarkText: {
    fontSize: 16,
    fontWeight: '900',
    color: theme.colors.naverGreen,
    letterSpacing: -0.5,
  },
  addScheduleFab: {
    position: 'absolute',
    bottom: 20,
    right: 16,
    backgroundColor: theme.colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 22,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  addScheduleFabText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
  },
  bottomDrawerSheet: {
    backgroundColor: theme.colors.surfaceCard,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 32,
    marginTop: -18,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.08,
    shadowRadius: 28,
    elevation: 8,
  },
  drawerHandle: {
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#CBD5E1',
    alignSelf: 'center',
    marginBottom: 12,
  },
  drawerHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  friendsCountBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  drawerTitleText: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  drawerTitleCount: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.primary,
    marginLeft: 2,
  },
  drawerArrow: {
    fontSize: 20,
    color: theme.colors.outline,
    marginLeft: 2,
  },
  togetherGroupChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceContainerLow,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 16,
    gap: 6,
  },
  togetherText: {
    fontSize: 11,
    fontWeight: '500',
    color: theme.colors.textSecondary,
  },
  togetherCount: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  avatarStack: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stackImg: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: '#FFF',
  },
  drawerArrowMini: {
    fontSize: 14,
    color: theme.colors.outline,
  },
  statusTagsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 14,
  },
  statusTagPill: {
    height: 32,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: theme.colors.surfaceContainerLow,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusTagPillActive: {
    backgroundColor: theme.colors.inverseSurface,
  },
  statusTagText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  statusTagTextActive: {
    color: '#FFF',
  },
  statusTagCount: {
    fontSize: 11,
    color: theme.colors.outline,
  },
  friendsCardScroll: {
    flexDirection: 'row',
    gap: 12,
    paddingBottom: 8,
  },
  friendCardItem: {
    width: 76,
    alignItems: 'center',
  },
  friendCardAvatarBox: {
    width: 64,
    height: 64,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  friendCardAvatarImg: {
    width: 58,
    height: 58,
    resizeMode: 'contain',
  },
  friendCardBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#FFF',
  },
  friendCardNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  friendCardName: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  friendCardStatus: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    marginTop: 1,
  },
  friendCardLocation: {
    fontSize: 10,
    color: theme.colors.textMuted,
    marginTop: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  friendSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
  },
  modalHeaderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 20,
  },
  modalAvatarLarge: {
    width: 64,
    height: 64,
    resizeMode: 'contain',
  },
  modalFriendName: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  modalFriendDetail: {
    fontSize: 13,
    color: theme.colors.textMuted,
    marginTop: 4,
  },
  reactionSection: {
    marginBottom: 20,
  },
  reactionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: 10,
  },
  reactionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  reactionBtn: {
    backgroundColor: theme.colors.surfaceContainerLow,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 16,
  },
  reactionBtnText: {
    fontSize: 13,
    fontWeight: '600',
  },
  closeBtn: {
    backgroundColor: '#E5E7EB',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  closeBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  inputModalSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
  },
  modalHeaderTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 16,
  },
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
  inputBtnRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  cancelBtn: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 12,
  },
  cancelBtnText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '600',
  },
  submitBtn: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  submitBtnText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
