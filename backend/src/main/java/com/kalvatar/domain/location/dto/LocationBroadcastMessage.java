package com.kalvatar.domain.location.dto;

import com.kalvatar.domain.activity.entity.ActivitySession;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LocationBroadcastMessage {

    private Long userId;
    private String nickname;
    private String avatarId;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private ActivitySession.ActivityType activityType;
    private ActivitySession.MotionMode motionMode;
    private boolean isApproximate;
    private String locationDisplay;
    private LocalDateTime timestamp;
}
