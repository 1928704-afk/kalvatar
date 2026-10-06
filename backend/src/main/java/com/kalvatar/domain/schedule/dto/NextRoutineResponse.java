package com.kalvatar.domain.schedule.dto;

import com.kalvatar.domain.schedule.entity.RoutineTask;
import com.kalvatar.domain.schedule.entity.Schedule;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NextRoutineResponse {

    private Long scheduleId;
    private String title;
    private Schedule.ScheduleCategory category;
    private LocalDateTime startTime;
    private String locationName;
    private RoutineInfo currentRoutine;

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RoutineInfo {
        private Long routineId;
        private RoutineTask.TaskType taskType;
        private String instruction;
        private LocalDateTime scheduledAt;
        private Long minutesRemaining;
        private boolean isCompleted;
        private RoutineTask.ExternalAppAction externalAppAction;
    }
}
