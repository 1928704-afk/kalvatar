package com.kalvatar.domain.user.controller;

import com.kalvatar.domain.user.dto.AuthRequest;
import com.kalvatar.domain.user.dto.AuthResponse;
import com.kalvatar.domain.user.service.AuthService;
import com.kalvatar.global.common.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/social-login")
    public ResponseEntity<ApiResponse<AuthResponse>> socialLogin(
            @Valid @RequestBody AuthRequest request) {
        AuthResponse response = authService.loginOrRegister(request);
        return ResponseEntity.ok(ApiResponse.ok(response, "로그인 및 토큰 발급이 완료되었습니다."));
    }
}
