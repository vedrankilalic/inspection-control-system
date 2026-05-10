package com.inspection.productinspectionapi.dto;

import java.time.LocalDateTime;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class InspectionControlUpsertRequest {
    @NotNull
    private LocalDateTime inspectionDateTime;

    @NotNull
    private Long inspectionBodyId;

    @NotNull
    private Long productId;

    @NotBlank
    private String results;

    @NotNull
    private Boolean productSafe;
}

