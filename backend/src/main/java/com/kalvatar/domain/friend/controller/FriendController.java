package com.kalvatar.domain.friend.controller;

import com.kalvatar.domain.friend.entity.Friendship;
import com.kalvatar.domain.friend.service.FriendService;
import com.kalvatar.global.common.ApiResponse;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/friends")
@RequiredArgsConstructor
public class FriendController {

    private final FriendService friendService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<FriendService.FriendResponse>>> getFriends(
            @RequestParam(defaultValue = "1") Long userId) {
        List<FriendService.FriendResponse> friends = friendService.getFriends(userId);
        return ResponseEntity.ok(ApiResponse.ok(friends));
    }

    @PatchMapping("/{friendshipId}/visibility")
    public ResponseEntity<ApiResponse<Void>> updateVisibility(
            @PathVariable Long friendshipId,
            @RequestBody VisibilityUpdateRequest request) {
        friendService.updateVisibility(friendshipId, request.getVisibility());
        return ResponseEntity.ok(ApiResponse.ok(null, "친구 공개 수준이 변경되었습니다."));
    }

    @Getter
    @NoArgsConstructor
    public static class VisibilityUpdateRequest {
        private Friendship.VisibilityOverride visibility;
    }
}
