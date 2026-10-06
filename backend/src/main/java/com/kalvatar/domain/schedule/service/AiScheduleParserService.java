package com.kalvatar.domain.schedule.service;

import com.kalvatar.domain.schedule.dto.ScheduleParseRequest;
import com.kalvatar.domain.schedule.dto.ScheduleParseResponse;
import com.kalvatar.domain.schedule.entity.RoutineTask;
import com.kalvatar.domain.schedule.entity.Schedule;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Slf4j
@Service
public class AiScheduleParserService {

    public ScheduleParseResponse parseNaturalLanguage(ScheduleParseRequest request) {
        String text = request.getRawText().trim();
        log.info("AI 일정 파싱 시작: {}", text);

        // 1. 카테고리 판별
        Schedule.ScheduleCategory category = determineCategory(text);

        // 2. 시작 시간 및 소요 시간 분석
        LocalTime startTime = extractTime(text);
        int durationMinutes = extractDuration(text);
        LocalDate startDate = LocalDate.now();

        LocalDateTime startDateTime = LocalDateTime.of(startDate, startTime);
        LocalDateTime endDateTime = startDateTime.plusMinutes(durationMinutes);

        // 3. 반복 요일 감지
        String repeatPattern = extractRepeatPattern(text);

        // 4. 장소 추출
        String locationName = extractLocation(text, category);

        // 5. 이동 시간 추정 (기본 15~20분, 장소 기반)
        int estimatedTransitMinutes = 18;

        // 6. 목적지 좌표 (예시 좌표 매핑)
        BigDecimal destinationLat = new BigDecimal("37.502819");
        BigDecimal destinationLng = new BigDecimal("127.036511");

        ScheduleParseResponse.ParsedSchedule parsedSchedule = ScheduleParseResponse.ParsedSchedule.builder()
                .title(generateTitle(category, locationName))
                .category(category)
                .startTime(startDateTime)
                .endTime(endDateTime)
                .locationName(locationName)
                .destinationLat(destinationLat)
                .destinationLng(destinationLng)
                .repeatPattern(repeatPattern)
                .estimatedTransitMinutes(estimatedTransitMinutes)
                .build();

        // 7. 카테고리별 행동 루틴 자동 생성
        List<ScheduleParseResponse.SuggestedRoutine> routines = generateRoutines(category, startDateTime, estimatedTransitMinutes);

        return ScheduleParseResponse.builder()
                .parsedSchedule(parsedSchedule)
                .suggestedRoutines(routines)
                .build();
    }

    private Schedule.ScheduleCategory determineCategory(String text) {
        if (text.contains("운동") || text.contains("헬스") || text.contains("피트니스") || text.contains("러닝") || text.contains("수영")) {
            return Schedule.ScheduleCategory.WORKOUT;
        } else if (text.contains("회의") || text.contains("업무") || text.contains("미팅") || text.contains("출근")) {
            return Schedule.ScheduleCategory.WORK;
        } else if (text.contains("공부") || text.contains("스터디") || text.contains("독서") || text.contains("과제")) {
            return Schedule.ScheduleCategory.STUDY;
        } else if (text.contains("병원") || text.contains("진료") || text.contains("약국") || text.contains("치과")) {
            return Schedule.ScheduleCategory.HOSPITAL;
        } else if (text.contains("약속") || text.contains("카페") || text.contains("식사") || text.contains("저녁") && text.contains("만남")) {
            return Schedule.ScheduleCategory.APPOINTMENT;
        }
        return Schedule.ScheduleCategory.REST;
    }

    private LocalTime extractTime(String text) {
        Pattern pattern = Pattern.compile("(오전|오후|저녁|아침|새벽)?\\s*(\\d{1,2})시(?:\\s*(\\d{1,2})분)?");
        Matcher matcher = pattern.matcher(text);

        if (matcher.find()) {
            String meridiem = matcher.group(1);
            int hour = Integer.parseInt(matcher.group(2));
            int minute = matcher.group(3) != null ? Integer.parseInt(matcher.group(3)) : 0;

            if ("오후".equals(meridiem) || "저녁".equals(meridiem)) {
                if (hour < 12) hour += 12;
            } else if ("오전".equals(meridiem) || "아침".equals(meridiem)) {
                if (hour == 12) hour = 0;
            } else if (hour <= 7 && (text.contains("저녁") || text.contains("밤"))) {
                hour += 12; // 문맥상 저녁 언급 시
            }

            return LocalTime.of(hour, minute);
        }
        return LocalTime.of(19, 0); // 기본값 19:00
    }

    private int extractDuration(String text) {
        Pattern hourPattern = Pattern.compile("(\\d+)\\s*시간");
        Matcher hourMatcher = hourPattern.matcher(text);
        if (hourMatcher.find()) {
            return Integer.parseInt(hourMatcher.group(1)) * 60;
        }

        Pattern minPattern = Pattern.compile("(\\d+)\\s*분");
        Matcher minMatcher = minPattern.matcher(text);
        if (minMatcher.find()) {
            return Integer.parseInt(minMatcher.group(1));
        }

        return 60; // 기본 1시간
    }

    private String extractRepeatPattern(String text) {
        if (text.contains("매일")) return "DAILY";
        if (text.contains("월") && text.contains("수") && text.contains("금")) return "MON_WED_FRI";
        if (text.contains("화") && text.contains("목")) return "TUE_THU";
        if (text.contains("주말") || text.contains("토") && text.contains("일")) return "WEEKEND";
        return "NONE";
    }

    private String extractLocation(String text, Schedule.ScheduleCategory category) {
        Pattern locPattern = Pattern.compile("([가-힣a-zA-Z0-9]+(?:헬스장|피트니스|역|카페|스터디룸|병원|빌딩|센터|공원))");
        Matcher matcher = locPattern.matcher(text);
        if (matcher.find()) {
            return matcher.group(1);
        }

        switch (category) {
            case WORKOUT: return "피트니스 센터";
            case WORK: return "오피스";
            case STUDY: return "스터디 카페";
            case HOSPITAL: return "병원";
            default: return "약속 장소";
        }
    }

    private String generateTitle(Schedule.ScheduleCategory category, String location) {
        switch (category) {
            case WORKOUT: return location + " 운동";
            case WORK: return "업무 및 회의";
            case STUDY: return "집중 스터디";
            case HOSPITAL: return location + " 진료";
            default: return location + " 일정";
        }
    }

    private List<ScheduleParseResponse.SuggestedRoutine> generateRoutines(
            Schedule.ScheduleCategory category, LocalDateTime startTime, int transitMinutes) {

        List<ScheduleParseResponse.SuggestedRoutine> routines = new ArrayList<>();

        switch (category) {
            case WORKOUT:
                routines.add(ScheduleParseResponse.SuggestedRoutine.builder()
                        .taskType(RoutineTask.TaskType.PREPARE)
                        .instruction("운동복 및 프로틴 챙기기 알림")
                        .scheduledAt(startTime.minusMinutes(transitMinutes + 20))
                        .sortOrder(1)
                        .externalAppAction(RoutineTask.ExternalAppAction.NONE)
                        .build());

                routines.add(ScheduleParseResponse.SuggestedRoutine.builder()
                        .taskType(RoutineTask.TaskType.DEPART)
                        .instruction("헬스장으로 출발 알림 (도보 " + transitMinutes + "분)")
                        .scheduledAt(startTime.minusMinutes(transitMinutes))
                        .sortOrder(2)
                        .externalAppAction(RoutineTask.ExternalAppAction.MAPS)
                        .build());

                routines.add(ScheduleParseResponse.SuggestedRoutine.builder()
                        .taskType(RoutineTask.TaskType.FOCUS_TIMER)
                        .instruction("운동 시작 & 타이머 구동")
                        .scheduledAt(startTime)
                        .sortOrder(3)
                        .externalAppAction(RoutineTask.ExternalAppAction.IN_APP_TIMER)
                        .build());

                routines.add(ScheduleParseResponse.SuggestedRoutine.builder()
                        .taskType(RoutineTask.TaskType.CHECKIN)
                        .instruction("운동 완료 확인 및 휴식 전환")
                        .scheduledAt(startTime.plusHours(1))
                        .sortOrder(4)
                        .externalAppAction(RoutineTask.ExternalAppAction.NONE)
                        .build());
                break;

            case STUDY:
                routines.add(ScheduleParseResponse.SuggestedRoutine.builder()
                        .taskType(RoutineTask.TaskType.PREPARE)
                        .instruction("학습 자료 및 노트북 준비")
                        .scheduledAt(startTime.minusMinutes(15))
                        .sortOrder(1)
                        .externalAppAction(RoutineTask.ExternalAppAction.NONE)
                        .build());
                routines.add(ScheduleParseResponse.SuggestedRoutine.builder()
                        .taskType(RoutineTask.TaskType.FOCUS_TIMER)
                        .instruction("집중 뽀모도로 타이머 시작")
                        .scheduledAt(startTime)
                        .sortOrder(2)
                        .externalAppAction(RoutineTask.ExternalAppAction.IN_APP_TIMER)
                        .build());
                break;

            default:
                routines.add(ScheduleParseResponse.SuggestedRoutine.builder()
                        .taskType(RoutineTask.TaskType.DEPART)
                        .instruction("목적지로 출발 알림")
                        .scheduledAt(startTime.minusMinutes(transitMinutes))
                        .sortOrder(1)
                        .externalAppAction(RoutineTask.ExternalAppAction.MAPS)
                        .build());
                routines.add(ScheduleParseResponse.SuggestedRoutine.builder()
                        .taskType(RoutineTask.TaskType.CHECKIN)
                        .instruction("일정 완료 체크인")
                        .scheduledAt(startTime.plusHours(1))
                        .sortOrder(2)
                        .externalAppAction(RoutineTask.ExternalAppAction.NONE)
                        .build());
                break;
        }

        return routines;
    }
}
