package com.kalvatar.global.common;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {

    // 400 Bad Request
    INVALID_INPUT_VALUE(HttpStatus.BAD_REQUEST, "C001", "잘못된 입력값입니다."),
    INVALID_SCHEDULE_FORMAT(HttpStatus.BAD_REQUEST, "S001", "일정의 시작 시간이나 장소를 식별할 수 없습니다."),

    // 401 Unauthorized
    UNAUTHORIZED(HttpStatus.UNAUTHORIZED, "A001", "인증 정보가 유효하지 않습니다."),
    EXPIRED_TOKEN(HttpStatus.UNAUTHORIZED, "A002", "만료된 토큰입니다."),

    // 403 Forbidden
    FORBIDDEN(HttpStatus.FORBIDDEN, "A003", "접근 권한이 없습니다."),

    // 404 Not Found
    USER_NOT_FOUND(HttpStatus.NOT_FOUND, "U001", "사용자를 찾을 수 없습니다."),
    SCHEDULE_NOT_FOUND(HttpStatus.NOT_FOUND, "S002", "일정을 찾을 수 없습니다."),
    ROUTINE_NOT_FOUND(HttpStatus.NOT_FOUND, "R001", "루틴을 찾을 수 없습니다."),
    FRIENDSHIP_NOT_FOUND(HttpStatus.NOT_FOUND, "F001", "친구 관계를 찾을 수 없습니다."),

    // 500 Internal Server Error
    INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "C002", "서버 내부 오류가 발생했습니다."),
    AI_SERVICE_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "AI001", "AI 일정 분석 처리 중 오류가 발생했습니다.");

    private final HttpStatus status;
    private final String code;
    private final String message;
}
