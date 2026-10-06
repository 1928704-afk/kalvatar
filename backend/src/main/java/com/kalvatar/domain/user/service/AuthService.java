package com.kalvatar.domain.user.service;

import com.kalvatar.domain.user.dto.AuthRequest;
import com.kalvatar.domain.user.dto.AuthResponse;
import com.kalvatar.domain.user.entity.User;
import com.kalvatar.domain.user.entity.UserProfile;
import com.kalvatar.domain.user.repository.UserProfileRepository;
import com.kalvatar.domain.user.repository.UserRepository;
import com.kalvatar.global.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;
    private final JwtTokenProvider jwtTokenProvider;

    @Transactional
    public AuthResponse loginOrRegister(AuthRequest request) {
        String provider = request.getProvider().toUpperCase();
        // 실제 프로덕션에서는 oauthToken으로 카카오/애플 서버에 요청하여 고유 회원 식별자를 추출
        String oauthId = "oauth_" + request.getOauthToken().hashCode();

        User user = userRepository.findByOauthProviderAndOauthId(provider, oauthId)
                .orElseGet(() -> {
                    log.info("신규 소셜 회원 가입 진행: provider={}, oauthId={}", provider, oauthId);
                    User newUser = User.builder()
                            .oauthProvider(provider)
                            .oauthId(oauthId)
                            .email(request.getEmail() != null ? request.getEmail() : "user_" + oauthId + "@kalvatar.com")
                            .status(User.UserStatus.ACTIVE)
                            .build();

                    User savedUser = userRepository.save(newUser);

                    UserProfile profile = UserProfile.builder()
                            .user(savedUser)
                            .nickname(request.getNickname() != null ? request.getNickname() : "러너_" + savedUser.getId())
                            .statusMessage("오늘도 힘찬 하루!")
                            .defaultVisibility(UserProfile.VisibilityLevel.APPROXIMATE)
                            .build();

                    userProfileRepository.save(profile);
                    return savedUser;
                });

        String accessToken = jwtTokenProvider.createAccessToken(user.getId());
        String refreshToken = jwtTokenProvider.createRefreshToken(user.getId());

        UserProfile profile = userProfileRepository.findByUserId(user.getId()).orElse(null);
        String nickname = profile != null ? profile.getNickname() : "사용자";
        String visibility = profile != null ? profile.getDefaultVisibility().name() : "APPROXIMATE";

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .expiresIn(7200L)
                .user(AuthResponse.UserInfo.builder()
                        .userId(user.getId())
                        .email(user.getEmail())
                        .nickname(nickname)
                        .defaultVisibility(visibility)
                        .build())
                .build();
    }
}
