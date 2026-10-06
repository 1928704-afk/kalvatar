package com.kalvatar.domain.location.dto;

import com.kalvatar.domain.activity.entity.ActivityReaction;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReactionMessage {

    private Long senderId;
    private String senderNickname;
    private Long targetUserId;
    private Long activitySessionId;
    private ActivityReaction.ReactionType reactionType; // FIRE, COFFEE, CHEER, HEART
    private LocalDateTime timestamp;
}
