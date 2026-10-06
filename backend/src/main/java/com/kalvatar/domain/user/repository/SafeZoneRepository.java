package com.kalvatar.domain.user.repository;

import com.kalvatar.domain.user.entity.SafeZone;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SafeZoneRepository extends JpaRepository<SafeZone, Long> {
    List<SafeZone> findByUserIdAndIsActiveTrue(Long userId);
}
