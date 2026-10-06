package com.kalvatar.domain.user.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthRequest {

    @NotBlank(message = "OAuth 제공자는 필수입니다.")
    private String provider; // KAKAO, APPLE, GOOGLE

    @NotBlank(message = "OAuth Token 또는 인가 코드는 필수입니다.")
    private String oauthToken;

    private String nickname;
    private String email;
}
