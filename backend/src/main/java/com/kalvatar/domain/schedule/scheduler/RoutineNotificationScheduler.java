package com.kalvatar.domain.schedule.scheduler;

import com.kalvatar.domain.schedule.entity.RoutineTask;
import com.kalvatar.domain.schedule.repository.RoutineTaskRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class RoutineNotificationScheduler {

    private final RoutineTaskRepository routineTaskRepository;

    /**
     * 매 분(00초)마다 실행되어 현재 시점에 발송되어야 할 루틴 알림 처리
     */
    @Scheduled(cron = "0 * * * * *")
    @Transactional
    public void dispatchRoutineNotifications() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime windowStart = now.minusSeconds(30);
        LocalDateTime windowEnd = now.plusSeconds(30);

        List<RoutineTask> dueTasks = routineTaskRepository.findByScheduledAtBetweenAndIsCompletedFalse(windowStart, windowEnd);

        if (!dueTasks.isEmpty()) {
            log.info("[알림 데몬] {}건의 루틴 알림 발송 대상 발견 (기준 시간: {})", dueTasks.size(), now);
            for (RoutineTask task : dueTasks) {
                sendNotification(task);
            }
        }
    }

    private void sendNotification(RoutineTask task) {
        // 실제 FCM / APNs 푸시 연동 지점
        log.info("🔔 [푸시 알림 발송] 일정: '{}', 단계: [{}], 문구: '{}', 액션: [{}]",
                task.getSchedule().getTitle(),
                task.getTaskType(),
                task.getInstruction(),
                task.getExternalAppAction()
        );
    }
}
