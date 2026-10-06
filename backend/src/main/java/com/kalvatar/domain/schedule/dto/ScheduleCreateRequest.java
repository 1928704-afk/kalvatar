package com.kalvatar.domain.schedule.dto;

import com.kalvatar.domain.schedule.entity.RoutineTask;
import com.kalvatar.domain.schedule.entity.Schedule;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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
public class ScheduleCreateRequest {

    @NotBlank(message = "일정 제목은 필수입니다.")
    private String title;

    @NotNull(message = "일정 카테고리는 필수입니다.")
    private Schedule.ScheduleCategory category;

    private String rawInputText;

    @NotNull(message = "시작 시간은 필수입니다.")
    private LocalDateTime startTime;

    @NotNull(message = "종료 시간은 필수입니다.")
    private LocalDateTime endTime;

    private String locationName;
    private BigDecimal destinationLat;
    private BigDecimal destinationLng;

    @Builder.Default
    private String repeatPattern = "NONE";

    @Builder.Default
    private Schedule.ScheduleVisibility visibility = Schedule.ScheduleVisibility.ALL_FRIENDS;

    private List<RoutineItem> routines;

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RoutineItem {
        private RoutineTask.TaskType taskType;
        private String instruction;
        private LocalDateTime scheduledAt;
        private Integer sortOrder;
        private RoutineTask.ExternalAppAction externalAppAction;
    }
}
