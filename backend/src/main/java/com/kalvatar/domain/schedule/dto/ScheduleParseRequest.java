package com.kalvatar.domain.schedule.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ScheduleParseRequest {

    @NotBlank(message = "일정 내용을 입력해주세요.")
    private String rawText;

    private BigDecimal userCurrentLat;
    private BigDecimal userCurrentLng;
}
