package com.kalvatar.domain.location;

import com.kalvatar.domain.activity.entity.ActivitySession;
import com.kalvatar.domain.friend.repository.FriendshipRepository;
import com.kalvatar.domain.location.dto.LocationBroadcastMessage;
import com.kalvatar.domain.location.dto.LocationReportMessage;
import com.kalvatar.domain.location.service.LocationService;
import com.kalvatar.domain.user.entity.SafeZone;
import com.kalvatar.domain.user.entity.User;
import com.kalvatar.domain.user.entity.UserProfile;
import com.kalvatar.domain.user.repository.SafeZoneRepository;
import com.kalvatar.domain.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.redis.core.GeoOperations;
import org.springframework.data.redis.core.RedisTemplate;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;

@ExtendWith(MockitoExtension.class)
class LocationServiceTest {

    @Mock
    private RedisTemplate<String, Object> redisTemplate;
    @Mock
    private GeoOperations<String, Object> geoOperations;
    @Mock
    private SafeZoneRepository safeZoneRepository;
    @Mock
    private FriendshipRepository friendshipRepository;
    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private LocationService locationService;

    private User testUser;
    private SafeZone homeSafeZone;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .id(1L)
                .email("test@kalvatar.com")
                .oauthProvider("KAKAO")
                .oauthId("12345")
                .profile(UserProfile.builder().nickname("테스터").build())
                .build();

        // 우리 집 좌표 (반경 300m)
        homeSafeZone = SafeZone.builder()
                .id(10L)
                .user(testUser)
                .name("우리 집")
                .latitude(new BigDecimal("37.512000"))
                .longitude(new BigDecimal("127.045000"))
                .radiusMeter(300)
                .maskingActivity("REST")
                .isActive(true)
                .build();
    }

    @Test
    @DisplayName("안심존(Safe Zone) 반경 내부로 진입하면 좌표가 마스킹되고 활동이 휴식으로 치환되어야 한다")
    void processLocationReportInsideSafeZone() {
        // given: 집 중심 좌표에서 불과 50m 떨어진 위치 보고
        LocationReportMessage report = LocationReportMessage.builder()
                .userId(1L)
                .latitude(new BigDecimal("37.512100"))
                .longitude(new BigDecimal("127.045100"))
                .motionMode(ActivitySession.MotionMode.STATIONARY)
                .build();

        given(redisTemplate.opsForGeo()).willReturn(geoOperations);
        given(safeZoneRepository.findByUserIdAndIsActiveTrue(1L)).willReturn(List.of(homeSafeZone));
        given(userRepository.findById(1L)).willReturn(Optional.of(testUser));

        // when
        LocationBroadcastMessage result = locationService.processLocationReport(report);

        // then
        assertThat(result).isNotNull();
        assertThat(result.isApproximate()).isTrue(); // 마스킹 활성화
        assertThat(result.getActivityType()).isEqualTo(ActivitySession.ActivityType.REST);
        assertThat(result.getLocationDisplay()).contains("우리 집에서 휴식 중");
    }

    @Test
    @DisplayName("안심존 외부에서 이동 중일 때는 실제 좌표와 이동 활동이 그대로 브로드캐스트되어야 한다")
    void processLocationReportOutsideSafeZone() {
        // given: 집에서 5km 떨어진 도로
        LocationReportMessage report = LocationReportMessage.builder()
                .userId(1L)
                .latitude(new BigDecimal("37.550000"))
                .longitude(new BigDecimal("127.080000"))
                .motionMode(ActivitySession.MotionMode.WALKING)
                .build();

        given(redisTemplate.opsForGeo()).willReturn(geoOperations);
        given(safeZoneRepository.findByUserIdAndIsActiveTrue(1L)).willReturn(List.of(homeSafeZone));
        given(userRepository.findById(1L)).willReturn(Optional.of(testUser));

        // when
        LocationBroadcastMessage result = locationService.processLocationReport(report);

        // then
        assertThat(result).isNotNull();
        assertThat(result.isApproximate()).isFalse(); // 마스킹 안 됨
        assertThat(result.getActivityType()).isEqualTo(ActivitySession.ActivityType.MOVING);
        assertThat(result.getLocationDisplay()).isEqualTo("이동 중");
    }
}
