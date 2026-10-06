package com.kalvatar.domain.friend.entity;

import com.kalvatar.domain.user.entity.User;
import com.kalvatar.global.common.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "friendships", uniqueConstraints = {
        @UniqueConstraint(name = "uk_requester_receiver", columnNames = {"requester_id", "receiver_id"})
}, indexes = {
        @Index(name = "idx_receiver_status", columnList = "receiver_id, status")
})
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Friendship extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "requester_id", nullable = false)
    private User requester;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "receiver_id", nullable = false)
    private User receiver;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private FriendshipStatus status = FriendshipStatus.PENDING;

    @Enumerated(EnumType.STRING)
    @Column(name = "visibility_override", nullable = false, length = 20)
    @Builder.Default
    private VisibilityOverride visibilityOverride = VisibilityOverride.DEFAULT;

    @Column(name = "established_at")
    private LocalDateTime establishedAt;

    public enum FriendshipStatus {
        PENDING, ACCEPTED, REJECTED, BLOCKED
    }

    public enum VisibilityOverride {
        DEFAULT, PRECISE, APPROXIMATE, ACTIVITY_ONLY, GHOST
    }

    public void accept() {
        this.status = FriendshipStatus.ACCEPTED;
        this.establishedAt = LocalDateTime.now();
    }

    public void updateVisibility(VisibilityOverride override) {
        this.visibilityOverride = override;
    }
}
