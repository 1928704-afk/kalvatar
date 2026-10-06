package com.kalvatar.domain.user.entity;

import com.kalvatar.global.common.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users", uniqueConstraints = {
        @UniqueConstraint(name = "uk_oauth", columnNames = {"oauth_provider", "oauth_id"})
})
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class User extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 100)
    private String email;

    @Column(name = "oauth_provider", nullable = false, length = 20)
    private String oauthProvider; // KAKAO, APPLE, GOOGLE

    @Column(name = "oauth_id", nullable = false, length = 100)
    private String oauthId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private UserStatus status = UserStatus.ACTIVE;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private UserProfile profile;

    public enum UserStatus {
        ACTIVE, INACTIVE, SUSPENDED
    }
}
