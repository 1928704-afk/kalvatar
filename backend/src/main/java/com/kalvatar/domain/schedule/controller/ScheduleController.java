package com.kalvatar.domain.schedule.controller;

import com.kalvatar.domain.schedule.dto.NextRoutineResponse;
import com.kalvatar.domain.schedule.dto.ScheduleCreateRequest;
import com.kalvatar.domain.schedule.dto.ScheduleParseRequest;
import com.kalvatar.domain.schedule.dto.ScheduleParseResponse;
import com.kalvatar.domain.schedule.service.ScheduleService;
import com.kalvatar.global.common.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/schedules")
@RequiredArgsConstructor
public class ScheduleController {

    private final ScheduleService scheduleService;

    /**
     * SCR-03: 자연어 일정 AI 파싱 & 루틴 자동 생성
     */
    @PostMapping("/parse")
    public ResponseEntity<ApiResponse<ScheduleParseResponse>> parseSchedule(
            @Valid @RequestBody ScheduleParseRequest request) {
        ScheduleParseResponse response = scheduleService.parseSchedule(request);
        return ResponseEntity.ok(ApiResponse.ok(response, "일정 및 행동 루틴 분석이 완료되었습니다."));
    }

    /**
     * 일정 및 루틴 최종 저장
     */
    @PostMapping
    public ResponseEntity<ApiResponse<Long>> createSchedule(
            @RequestParam(defaultValue = "1") Long userId,
            @Valid @RequestBody ScheduleCreateRequest request) {
        Long scheduleId = scheduleService.createSchedule(userId, request);
        return ResponseEntity.ok(ApiResponse.ok(scheduleId, "일정이 성공적으로 등록되었습니다."));
    }

    /**
     * SCR-02 홈 지도 뷰용: 다음 일정 & 현재 루틴 조회
     */
    @GetMapping("/next-routine")
    public ResponseEntity<ApiResponse<NextRoutineResponse>> getNextRoutine(
            @RequestParam(defaultValue = "1") Long userId) {
        NextRoutineResponse response = scheduleService.getNextRoutine(userId);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    /**
     * 루틴 완료 체크인
     */
    @PatchMapping("/routines/{routineId}/complete")
    public ResponseEntity<ApiResponse<Void>> completeRoutine(
            @PathVariable Long routineId) {
        scheduleService.completeRoutine(routineId);
        return ResponseEntity.ok(ApiResponse.ok(null, "루틴이 완료되었습니다."));
    }
}
