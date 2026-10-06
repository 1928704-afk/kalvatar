package com.kalvatar.domain.schedule;

import com.kalvatar.domain.schedule.dto.ScheduleParseRequest;
import com.kalvatar.domain.schedule.dto.ScheduleParseResponse;
import com.kalvatar.domain.schedule.entity.RoutineTask;
import com.kalvatar.domain.schedule.entity.Schedule;
import com.kalvatar.domain.schedule.service.AiScheduleParserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalTime;

import static org.assertj.core.api.Assertions.assertThat;

class AiScheduleParserServiceTest {

    private AiScheduleParserService parserService;

    @BeforeEach
    void setUp() {
        parserService = new AiScheduleParserService();
    }

    @Test
    @DisplayName("자연어 운동 일정 입력 시 카테고리, 시간, 4단계 루틴이 정상 생성되어야 한다")
    void parseWorkoutScheduleSuccess() {
        // given
        ScheduleParseRequest request = ScheduleParseRequest.builder()
                .rawText("월요일, 수요일, 금요일 저녁 7시에 역삼 피트니스에서 1시간 웨이트 운동")
                .userCurrentLat(new BigDecimal("37.500000"))
                .userCurrentLng(new BigDecimal("127.030000"))
                .build();

        // when
        ScheduleParseResponse response = parserService.parseNaturalLanguage(request);

        // then
        assertThat(response).isNotNull();

        // 1. 일정 정보 검증
        ScheduleParseResponse.ParsedSchedule parsed = response.getParsedSchedule();
        assertThat(parsed.getCategory()).isEqualTo(Schedule.ScheduleCategory.WORKOUT);
        assertThat(parsed.getLocationName()).contains("역삼 피트니스");
        assertThat(parsed.getStartTime().toLocalTime()).isEqualTo(LocalTime.of(19, 0));
        assertThat(parsed.getEndTime().toLocalTime()).isEqualTo(LocalTime.of(20, 0));
        assertThat(parsed.getRepeatPattern()).isEqualTo("MON_WED_FRI");

        // 2. 4단계 자동 생성 루틴 검증
        assertThat(response.getSuggestedRoutines()).hasSize(4);
        assertThat(response.getSuggestedRoutines().get(0).getTaskType()).isEqualTo(RoutineTask.TaskType.PREPARE);
        assertThat(response.getSuggestedRoutines().get(1).getTaskType()).isEqualTo(RoutineTask.TaskType.DEPART);
        assertThat(response.getSuggestedRoutines().get(1).getExternalAppAction()).isEqualTo(RoutineTask.ExternalAppAction.MAPS);
        assertThat(response.getSuggestedRoutines().get(2).getTaskType()).isEqualTo(RoutineTask.TaskType.FOCUS_TIMER);
        assertThat(response.getSuggestedRoutines().get(3).getTaskType()).isEqualTo(RoutineTask.TaskType.CHECKIN);
    }

    @Test
    @DisplayName("공부/스터디 일정 입력 시 포커스 타이머 루틴이 정상 제안되어야 한다")
    void parseStudyScheduleSuccess() {
        // given
        ScheduleParseRequest request = ScheduleParseRequest.builder()
                .rawText("오후 3시 강남 스터디카페에서 2시간 집중 공부")
                .build();

        // when
        ScheduleParseResponse response = parserService.parseNaturalLanguage(request);

        // then
        ScheduleParseResponse.ParsedSchedule parsed = response.getParsedSchedule();
        assertThat(parsed.getCategory()).isEqualTo(Schedule.ScheduleCategory.STUDY);
        assertThat(parsed.getStartTime().toLocalTime()).isEqualTo(LocalTime.of(15, 0));
        assertThat(parsed.getEndTime().toLocalTime()).isEqualTo(LocalTime.of(17, 0));
        assertThat(response.getSuggestedRoutines()).isNotEmpty();
    }
}
