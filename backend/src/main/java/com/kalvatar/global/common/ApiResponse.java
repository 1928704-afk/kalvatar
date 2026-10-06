package com.kalvatar.global.common;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApiResponse<T> {

    private boolean success;
    private T data;
    private String message;
    private ErrorDetail error;
    private LocalDateTime timestamp;

    public static <T> ApiResponse<T> ok(T data) {
        return ApiResponse.<T>builder()
                .success(true)
                .data(data)
                .timestamp(LocalDateTime.now())
                .build();
    }

    public static <T> ApiResponse<T> ok(T data, String message) {
        return ApiResponse.<T>builder()
                .success(true)
                .data(data)
                .message(message)
                .timestamp(LocalDateTime.now())
                .build();
    }

    public static <T> ApiResponse<T> error(ErrorCode errorCode) {
        return ApiResponse.<T>builder()
                .success(false)
                .error(new ErrorDetail(errorCode.getCode(), errorCode.getMessage()))
                .timestamp(LocalDateTime.now())
                .build();
    }

    public static <T> ApiResponse<T> error(ErrorCode errorCode, String message) {
        return ApiResponse.<T>builder()
                .success(false)
                .error(new ErrorDetail(errorCode.getCode(), message))
                .timestamp(LocalDateTime.now())
                .build();
    }

    @Getter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ErrorDetail {
        private String code;
        private String message;
    }
}
