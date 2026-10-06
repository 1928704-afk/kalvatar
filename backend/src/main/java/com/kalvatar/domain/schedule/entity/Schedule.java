package com.kalvatar.domain.schedule.entity;

import com.kalvatar.domain.user.entity.User;
import com.kalvatar.global.common.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "schedules", indexes = {
        @Index(name = "idx_schedules_user_time", columnList = "user_id, start_time")
})
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Schedule extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 100)
    private String title;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private ScheduleCategory category;

    @Column(name = "raw_input_text", columnDefinition = "TEXT")
    private String rawInputText;

    @Column(name = "start_time", nullable = false)
    private LocalDateTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalDateTime endTime;

    @Column(name = "location_name", length = 100)
    private String locationName;

    @Column(name = "destination_lat", precision = 10, scale = 8)
    private BigDecimal destinationLat;

    @Column(name = "destination_lng", precision = 11, scale = 8)
    private BigDecimal destinationLng;

    @Column(name = "repeat_pattern", nullable = false, length = 50)
    @Builder.Default
    private String repeatPattern = "NONE";

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private ScheduleVisibility visibility = ScheduleVisibility.ALL_FRIENDS;

    @OneToMany(mappedBy = "schedule", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<RoutineTask> routines = new ArrayList<>();

    public enum ScheduleCategory {
        WORKOUT, WORK, STUDY, HOSPITAL, APPOINTMENT, REST, ETC
    }

    public enum ScheduleVisibility {
        ALL_FRIENDS, CLOSE_FRIENDS, PRIVATE
    }

    public void addRoutine(RoutineTask routine) {
        this.routines.add(routine);
        routine.assignSchedule(this);
    }
}
