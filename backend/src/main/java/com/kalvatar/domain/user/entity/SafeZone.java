package com.kalvatar.domain.user.entity;

import com.kalvatar.global.common.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "safe_zones", indexes = {
        @Index(name = "idx_safezones_user", columnList = "user_id")
})
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class SafeZone extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 50)
    private String name;

    @Column(nullable = false, precision = 10, scale = 8)
    private BigDecimal latitude;

    @Column(nullable = false, precision = 11, scale = 8)
    private BigDecimal longitude;

    @Column(name = "radius_meter", nullable = false)
    @Builder.Default
    private Integer radiusMeter = 300;

    @Column(name = "masking_activity", nullable = false, length = 30)
    @Builder.Default
    private String maskingActivity = "REST";

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private boolean isActive = true;
}
