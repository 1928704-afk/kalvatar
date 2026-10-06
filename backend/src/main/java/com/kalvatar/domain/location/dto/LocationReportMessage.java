package com.kalvatar.domain.location.dto;

import com.kalvatar.domain.activity.entity.ActivitySession;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LocationReportMessage {

    private Long userId;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private Double accuracyMeter;
    private ActivitySession.MotionMode motionMode; // STATIONARY, WALKING, DRIVING, TRANSIT
    private Double speedMps;
}
