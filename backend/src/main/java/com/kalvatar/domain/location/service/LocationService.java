package com.kalvatar.domain.location.service;

import com.kalvatar.domain.activity.entity.ActivitySession;
import com.kalvatar.domain.friend.entity.Friendship;
import com.kalvatar.domain.friend.repository.FriendshipRepository;
import com.kalvatar.domain.location.dto.LocationBroadcastMessage;
import com.kalvatar.domain.location.dto.LocationReportMessage;
import com.kalvatar.domain.user.entity.SafeZone;
import com.kalvatar.domain.user.entity.User;
import com.kalvatar.domain.user.repository.SafeZoneRepository;
import com.kalvatar.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.geo.Point;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class LocationService {

    private final RedisTemplate<String, Object> redisTemplate;
    private final SafeZoneRepository safeZoneRepository;
    private final FriendshipRepository friendshipRepository;
    private final UserRepository userRepository;

    private static final String REDIS_GEO_KEY = "geo:user_locations";
    private static final double EARTH_RADIUS_METERS = 6371000.0;

    /**
     * 위치 보고 처리 및 마스킹된 브로드캐스트 데이터 생성
     */
    public LocationBroadcastMessage processLocationReport(LocationReportMessage report) {
        Long userId = report.getUserId();

        // 1. Redis GEO에 최신 좌표 캐싱
        try {
            redisTemplate.opsForGeo().add(
                    REDIS_GEO_KEY,
                    new Point(report.getLongitude().doubleValue(), report.getLatitude().doubleValue()),
                    String.valueOf(userId)
            );
        } catch (Exception e) {
            log.warn("Redis GEO 저장 실패 (무시하고 계속 진행): {}", e.getMessage());
        }

        // 2. 안심존(Safe Zone) 검증
        List<SafeZone> safeZones = safeZoneRepository.findByUserIdAndIsActiveTrue(userId);
        SafeZone matchedSafeZone = null;

        for (SafeZone sz : safeZones) {
            double distance = calculateHaversineDistance(
                    report.getLatitude().doubleValue(),
                    report.getLongitude().doubleValue(),
                    sz.getLatitude().doubleValue(),
                    sz.getLongitude().doubleValue()
            );
            if (distance <= sz.getRadiusMeter()) {
                matchedSafeZone = sz;
                break;
            }
        }

        // 3. 사용자 정보 조회 (닉네임/캐릭터)
        User user = userRepository.findById(userId).orElse(null);
        String nickname = (user != null && user.getProfile() != null) ? user.getProfile().getNickname() : "사용자_" + userId;

        // 4. 안심존 내부인 경우 좌표 마스킹 및 활동 치환
        boolean isMasked = matchedSafeZone != null;
        BigDecimal finalLat = isMasked ? matchedSafeZone.getLatitude() : report.getLatitude();
        BigDecimal finalLng = isMasked ? matchedSafeZone.getLongitude() : report.getLongitude();
        ActivitySession.ActivityType activityType = isMasked
                ? ActivitySession.ActivityType.REST
                : determineActivityByMotion(report.getMotionMode());

        String locationDisplay = isMasked
                ? matchedSafeZone.getName() + "에서 휴식 중"
                : (report.getMotionMode() == ActivitySession.MotionMode.STATIONARY ? "활동 중" : "이동 중");

        return LocationBroadcastMessage.builder()
                .userId(userId)
                .nickname(nickname)
                .avatarId("AVATAR_DEFAULT")
                .latitude(finalLat)
                .longitude(finalLng)
                .activityType(activityType)
                .motionMode(report.getMotionMode())
                .isApproximate(isMasked)
                .locationDisplay(locationDisplay)
                .timestamp(LocalDateTime.now())
                .build();
    }

    /**
     * 해당 사용자의 친구 ID 목록 조회
     */
    public List<Long> getFriendIds(Long userId) {
        List<Friendship> friendships = friendshipRepository.findAllAcceptedFriendsByUserId(userId);
        return friendships.stream()
                .map(f -> f.getRequester().getId().equals(userId) ? f.getReceiver().getId() : f.getRequester().getId())
                .toList();
    }

    /**
     * 하버사인 공식 (두 위경도 간 거리 미터 단위 계산)
     */
    private double calculateHaversineDistance(double lat1, double lon1, double lat2, double lon2) {
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);

        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                        Math.sin(dLon / 2) * Math.sin(dLon / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return EARTH_RADIUS_METERS * c;
    }

    private ActivitySession.ActivityType determineActivityByMotion(ActivitySession.MotionMode motionMode) {
        if (motionMode == ActivitySession.MotionMode.WALKING || motionMode == ActivitySession.MotionMode.DRIVING || motionMode == ActivitySession.MotionMode.TRANSIT) {
            return ActivitySession.ActivityType.MOVING;
        }
        return ActivitySession.ActivityType.REST;
    }
}
