package com.kalvatar.domain.schedule.service;

import com.kalvatar.domain.schedule.dto.*;
import com.kalvatar.domain.schedule.entity.RoutineTask;
import com.kalvatar.domain.schedule.entity.Schedule;
import com.kalvatar.domain.schedule.repository.RoutineTaskRepository;
import com.kalvatar.domain.schedule.repository.ScheduleRepository;
import com.kalvatar.domain.user.entity.User;
import com.kalvatar.domain.user.repository.UserRepository;
import com.kalvatar.global.common.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ScheduleService {

    private final ScheduleRepository scheduleRepository;
    private final RoutineTaskRepository routineTaskRepository;
    private final UserRepository userRepository;
    private final AiScheduleParserService aiScheduleParserService;

    public ScheduleParseResponse parseSchedule(ScheduleParseRequest request) {
        return aiScheduleParserService.parseNaturalLanguage(request);
    }

    @Transactional
    public Long createSchedule(Long userId, ScheduleCreateRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        Schedule schedule = Schedule.builder()
                .user(user)
                .title(request.getTitle())
                .category(request.getCategory())
                .rawInputText(request.getRawInputText())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .locationName(request.getLocationName())
                .destinationLat(request.getDestinationLat())
                .destinationLng(request.getDestinationLng())
                .repeatPattern(request.getRepeatPattern())
                .visibility(request.getVisibility())
                .build();

        if (request.getRoutines() != null) {
            for (ScheduleCreateRequest.RoutineItem item : request.getRoutines()) {
                RoutineTask task = RoutineTask.builder()
                        .taskType(item.getTaskType())
                        .instruction(item.getInstruction())
                        .scheduledAt(item.getScheduledAt())
                        .sortOrder(item.getSortOrder())
                        .externalAppAction(item.getExternalAppAction())
                        .build();
                schedule.addRoutine(task);
            }
        }

        Schedule savedSchedule = scheduleRepository.save(schedule);
        log.info("일정 및 루틴 저장 완료 ID: {}", savedSchedule.getId());
        return savedSchedule.getId();
    }

    public NextRoutineResponse getNextRoutine(Long userId) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime endOfDay = now.toLocalDate().atTime(23, 59, 59);

        List<Schedule> schedules = scheduleRepository.findByUserIdAndStartTimeBetweenOrderByStartTimeAsc(
                userId, now.minusHours(1), endOfDay);

        if (schedules.isEmpty()) {
            return null;
        }

        Schedule nextSchedule = schedules.get(0);
        RoutineTask activeRoutine = nextSchedule.getRoutines().stream()
                .filter(r -> !r.isCompleted())
                .findFirst()
                .orElse(null);

        NextRoutineResponse.RoutineInfo routineInfo = null;
        if (activeRoutine != null) {
            long minutesRemaining = Duration.between(now, activeRoutine.getScheduledAt()).toMinutes();
            routineInfo = NextRoutineResponse.RoutineInfo.builder()
                    .routineId(activeRoutine.getId())
                    .taskType(activeRoutine.getTaskType())
                    .instruction(activeRoutine.getInstruction())
                    .scheduledAt(activeRoutine.getScheduledAt())
                    .minutesRemaining(Math.max(0, minutesRemaining))
                    .isCompleted(activeRoutine.isCompleted())
                    .externalAppAction(activeRoutine.getExternalAppAction())
                    .build();
        }

        return NextRoutineResponse.builder()
                .scheduleId(nextSchedule.getId())
                .title(nextSchedule.getTitle())
                .category(nextSchedule.getCategory())
                .startTime(nextSchedule.getStartTime())
                .locationName(nextSchedule.getLocationName())
                .currentRoutine(routineInfo)
                .build();
    }

    @Transactional
    public void completeRoutine(Long routineId) {
        RoutineTask routine = routineTaskRepository.findById(routineId)
                .orElseThrow(() -> new IllegalArgumentException("루틴을 찾을 수 없습니다."));
        routine.complete();
        log.info("루틴 완료 처리 ID: {}", routineId);
    }
}
