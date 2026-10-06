package com.kalvatar.domain.user.controller;

import com.kalvatar.domain.user.service.SafeZoneService;
import com.kalvatar.global.common.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/safe-zones")
@RequiredArgsConstructor
public class SafeZoneController {

    private final SafeZoneService safeZoneService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<SafeZoneService.SafeZoneResponse>>> getSafeZones(
            @RequestParam(defaultValue = "1") Long userId) {
        List<SafeZoneService.SafeZoneResponse> list = safeZoneService.getSafeZones(userId);
        return ResponseEntity.ok(ApiResponse.ok(list));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Long>> createSafeZone(
            @RequestParam(defaultValue = "1") Long userId,
            @RequestBody SafeZoneService.SafeZoneCreateRequest request) {
        Long id = safeZoneService.createSafeZone(userId, request);
        return ResponseEntity.ok(ApiResponse.ok(id, "안심존이 성공적으로 등록되었습니다."));
    }
}
