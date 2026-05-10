package com.inspection.productinspectionapi.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class InspectionControlDto {
    private final Long id;
    private final LocalDateTime inspectionDateTime;
    private final Long inspectionBodyId;
    private final String inspectionBodyName;
    private final Long productId;
    private final String productName;
    private final Boolean productSafe;
}

