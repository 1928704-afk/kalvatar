package com.kalvatar.domain.location.controller;

import com.kalvatar.domain.location.dto.LocationBroadcastMessage;
import com.kalvatar.domain.location.dto.LocationReportMessage;
import com.kalvatar.domain.location.dto.ReactionMessage;
import com.kalvatar.domain.location.service.LocationService;
import com.kalvatar.global.common.ApiResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1/locations")
@RequiredArgsConstructor
public class LocationWebSocketController {

    private final LocationService locationService;
    private final SimpMessagingTemplate messagingTemplate;

    /**
     * 1. WebSocket STOMP 위치 보고 핸들러
     * 클라이언트 발신 경로: /pub/location/report
     */
    @MessageMapping("/location/report")
    public void handleLocationReport(LocationReportMessage report) {
        log.info("WebSocket 위치 보고 수신: 사용자={}, 위도={}, 경도={}, 모드={}",
                report.getUserId(), report.getLatitude(), report.getLongitude(), report.getMotionMode());

        LocationBroadcastMessage broadcastData = locationService.processLocationReport(report);
        List<Long> friendIds = locationService.getFriendIds(report.getUserId());

        // 각 친구의 개인 큐로 선별 브로드캐스트
        for (Long friendId : friendIds) {
            messagingTemplate.convertAndSendToUser(
                    String.valueOf(friendId),
                    "/sub/friends/locations",
                    broadcastData
            );
        }

        // 전체 공용 채널에도 전달 (개발/테스트용)
        messagingTemplate.convertAndSend("/sub/friends/locations", broadcastData);
    }

    /**
     * 2. WebSocket STOMP 실시간 리액션(🔥, ☕) 전송
     * 클라이언트 발신 경로: /pub/reaction/send
     */
    @MessageMapping("/reaction/send")
    public void handleReactionSend(ReactionMessage reaction) {
        log.info("실시간 응원 리액션 전송: 발신자={} -> 대상자={}, 반응={}",
                reaction.getSenderId(), reaction.getTargetUserId(), reaction.getReactionType());

        ReactionMessage payload = ReactionMessage.builder()
                .senderId(reaction.getSenderId())
                .senderNickname(reaction.getSenderNickname())
                .targetUserId(reaction.getTargetUserId())
                .activitySessionId(reaction.getActivitySessionId())
                .reactionType(reaction.getReactionType())
                .timestamp(LocalDateTime.now())
                .build();

        // 대상 사용자의 알림 채널로 실시간 푸시
        messagingTemplate.convertAndSendToUser(
                String.valueOf(reaction.getTargetUserId()),
                "/sub/notifications/reactions",
                payload
        );
    }

    /**
     * 3. REST HTTP 폴백 위치 보고 엔드포인트
     */
    @PostMapping("/report")
    public ResponseEntity<ApiResponse<LocationBroadcastMessage>> reportLocationRest(
            @RequestBody LocationReportMessage report) {
        LocationBroadcastMessage broadcastData = locationService.processLocationReport(report);
        messagingTemplate.convertAndSend("/sub/friends/locations", broadcastData);
        return ResponseEntity.ok(ApiResponse.ok(broadcastData, "위치가 성공적으로 보고 및 브로드캐스트되었습니다."));
    }
}
