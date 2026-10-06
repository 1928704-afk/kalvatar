package com.kalvatar.domain.activity.entity;

import com.kalvatar.domain.schedule.entity.Schedule;
import com.kalvatar.domain.user.entity.User;
import com.kalvatar.global.common.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "activity_sessions", indexes = {
        @Index(name = "idx_activity_user_time", columnList = "user_id, started_at")
})
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class ActivitySession extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "schedule_id")
    private Schedule schedule;

    @Enumerated(EnumType.STRING)
    @Column(name = "activity_type", nullable = false, length = 30)
    private ActivityType activityType;

    @Enumerated(EnumType.STRING)
    @Column(name = "motion_mode", nullable = false, length = 20)
    @Builder.Default
    private MotionMode motionMode = MotionMode.STATIONARY;

    @Column(name = "started_at", nullable = false)
    private LocalDateTime startedAt;

    @Column(name = "ended_at")
    private LocalDateTime endedAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private SessionStatus status;

    @Column(name = "last_lat", precision = 10, scale = 8)
    private BigDecimal lastLat;

    @Column(name = "last_lng", precision = 11, scale = 8)
    private BigDecimal lastLng;

    @Column(name = "location_name", length = 100)
    private String locationName;

    public enum ActivityType {
        WORKOUT, STUDY, WORK, CAFE, MOVING, REST
    }

    public enum MotionMode {
        STATIONARY, WALKING, DRIVING, TRANSIT
    }

    public enum SessionStatus {
        SCHEDULED, MOVING, ACTIVE, COMPLETED
    }

    public void completeSession(BigDecimal lat, BigDecimal lng) {
        this.status = SessionStatus.COMPLETED;
        this.endedAt = LocalDateTime.now();
        this.lastLat = lat;
        this.lastLng = lng;
    }
}
