package com.kalvatar.domain.schedule.entity;

import com.kalvatar.global.common.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "routine_tasks", indexes = {
        @Index(name = "idx_scheduled_completed", columnList = "scheduled_at, is_completed")
})
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class RoutineTask extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "schedule_id", nullable = false)
    private Schedule schedule;

    @Enumerated(EnumType.STRING)
    @Column(name = "task_type", nullable = false, length = 30)
    private TaskType taskType;

    @Column(nullable = false, length = 255)
    private String instruction;

    @Column(name = "scheduled_at", nullable = false)
    private LocalDateTime scheduledAt;

    @Column(name = "sort_order", nullable = false)
    @Builder.Default
    private Integer sortOrder = 0;

    @Enumerated(EnumType.STRING)
    @Column(name = "external_app_action", nullable = false, length = 30)
    @Builder.Default
    private ExternalAppAction externalAppAction = ExternalAppAction.NONE;

    @Column(name = "is_completed", nullable = false)
    @Builder.Default
    private boolean isCompleted = false;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    public enum TaskType {
        PREPARE, DEPART, FOCUS_TIMER, CHECKIN, CUSTOM
    }

    public enum ExternalAppAction {
        MAPS, MUSIC, IN_APP_TIMER, NONE
    }

    public void assignSchedule(Schedule schedule) {
        this.schedule = schedule;
    }

    public void complete() {
        this.isCompleted = true;
        this.completedAt = LocalDateTime.now();
    }
}
