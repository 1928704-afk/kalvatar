package com.kalvatar.domain.schedule.repository;

import com.kalvatar.domain.schedule.entity.RoutineTask;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface RoutineTaskRepository extends JpaRepository<RoutineTask, Long> {
    List<RoutineTask> findByScheduledAtBetweenAndIsCompletedFalse(
            LocalDateTime start, LocalDateTime end);
}
