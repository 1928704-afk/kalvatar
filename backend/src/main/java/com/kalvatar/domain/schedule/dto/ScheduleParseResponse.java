package com.kalvatar.domain.schedule.dto;

import com.kalvatar.domain.schedule.entity.RoutineTask;
import com.kalvatar.domain.schedule.entity.Schedule;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ScheduleParseResponse {

    private ParsedSchedule parsedSchedule;
    private List<SuggestedRoutine> suggestedRoutines;

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ParsedSchedule {
        private String title;
        private Schedule.ScheduleCategory category;
        private LocalDateTime startTime;
        private LocalDateTime endTime;
        private String locationName;
        private BigDecimal destinationLat;
        private BigDecimal destinationLng;
        private String repeatPattern;
        private Integer estimatedTransitMinutes;
    }

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SuggestedRoutine {
        private RoutineTask.TaskType taskType;
        private String instruction;
        private LocalDateTime scheduledAt;
        private Integer sortOrder;
        private RoutineTask.ExternalAppAction externalAppAction;
    }
}
