package com.kalvatar.domain.user.service;

import com.kalvatar.domain.user.entity.SafeZone;
import com.kalvatar.domain.user.entity.User;
import com.kalvatar.domain.user.repository.SafeZoneRepository;
import com.kalvatar.domain.user.repository.UserRepository;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SafeZoneService {

    private final SafeZoneRepository safeZoneRepository;
    private final UserRepository userRepository;

    public List<SafeZoneResponse> getSafeZones(Long userId) {
        return safeZoneRepository.findByUserIdAndIsActiveTrue(userId).stream()
                .map(SafeZoneResponse::from)
                .toList();
    }

    @Transactional
    public Long createSafeZone(Long userId, SafeZoneCreateRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        SafeZone safeZone = SafeZone.builder()
                .user(user)
                .name(request.getName())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .radiusMeter(request.getRadiusMeter() != null ? request.getRadiusMeter() : 300)
                .maskingActivity(request.getMaskingActivity() != null ? request.getMaskingActivity() : "REST")
                .isActive(true)
                .build();

        return safeZoneRepository.save(safeZone).getId();
    }

    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SafeZoneCreateRequest {
        private String name;
        private BigDecimal latitude;
        private BigDecimal longitude;
        private Integer radiusMeter;
        private String maskingActivity;
    }

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SafeZoneResponse {
        private Long id;
        private String name;
        private BigDecimal latitude;
        private BigDecimal longitude;
        private Integer radiusMeter;
        private String maskingActivity;
        private boolean isActive;

        public static SafeZoneResponse from(SafeZone sz) {
            return SafeZoneResponse.builder()
                    .id(sz.getId())
                    .name(sz.getName())
                    .latitude(sz.getLatitude())
                    .longitude(sz.getLongitude())
                    .radiusMeter(sz.getRadiusMeter())
                    .maskingActivity(sz.getMaskingActivity())
                    .isActive(sz.isActive())
                    .build();
        }
    }
}
