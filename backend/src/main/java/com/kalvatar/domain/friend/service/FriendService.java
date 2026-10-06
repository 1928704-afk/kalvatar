package com.kalvatar.domain.friend.service;

import com.kalvatar.domain.friend.entity.Friendship;
import com.kalvatar.domain.friend.repository.FriendshipRepository;
import com.kalvatar.domain.user.entity.User;
import com.kalvatar.domain.user.repository.UserRepository;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FriendService {

    private final FriendshipRepository friendshipRepository;
    private final UserRepository userRepository;

    public List<FriendResponse> getFriends(Long userId) {
        List<Friendship> friendships = friendshipRepository.findAllAcceptedFriendsByUserId(userId);
        return friendships.stream()
                .map(f -> {
                    User friendUser = f.getRequester().getId().equals(userId) ? f.getReceiver() : f.getRequester();
                    String nickname = friendUser.getProfile() != null ? friendUser.getProfile().getNickname() : "친구_" + friendUser.getId();
                    return FriendResponse.builder()
                            .friendshipId(f.getId())
                            .friendUserId(friendUser.getId())
                            .nickname(nickname)
                            .visibilityOverride(f.getVisibilityOverride().name())
                            .status(f.getStatus().name())
                            .build();
                })
                .toList();
    }

    @Transactional
    public void updateVisibility(Long friendshipId, Friendship.VisibilityOverride override) {
        Friendship friendship = friendshipRepository.findById(friendshipId)
                .orElseThrow(() -> new IllegalArgumentException("친구 관계를 찾을 수 없습니다."));
        friendship.updateVisibility(override);
    }

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FriendResponse {
        private Long friendshipId;
        private Long friendUserId;
        private String nickname;
        private String visibilityOverride;
        private String status;
    }
}
