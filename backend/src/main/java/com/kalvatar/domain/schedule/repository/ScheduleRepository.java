package com.kalvatar.domain.schedule.repository;

import com.kalvatar.domain.schedule.entity.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface ScheduleRepository extends JpaRepository<Schedule, Long> {
    List<Schedule> findByUserIdAndStartTimeBetweenOrderByStartTimeAsc(
            Long userId, LocalDateTime start, LocalDateTime end);
}
