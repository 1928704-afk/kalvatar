package com.kalvatar.domain.user.entity;

import com.kalvatar.global.common.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "user_profiles")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class UserProfile extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(nullable = false, length = 50)
    private String nickname;

    @Column(name = "status_message", length = 100)
    private String statusMessage;

    @Enumerated(EnumType.STRING)
    @Column(name = "default_visibility", nullable = false, length = 20)
    @Builder.Default
    private VisibilityLevel defaultVisibility = VisibilityLevel.APPROXIMATE;

    @Column(name = "battery_save_mode", nullable = false)
    @Builder.Default
    private boolean batterySaveMode = false;

    public enum VisibilityLevel {
        PRECISE, APPROXIMATE, ACTIVITY_ONLY, GHOST
    }

    public void updateProfile(String nickname, String statusMessage, VisibilityLevel defaultVisibility, Boolean batterySaveMode) {
        if (nickname != null) this.nickname = nickname;
        if (statusMessage != null) this.statusMessage = statusMessage;
        if (defaultVisibility != null) this.defaultVisibility = defaultVisibility;
        if (batterySaveMode != null) this.batterySaveMode = batterySaveMode;
    }
}
