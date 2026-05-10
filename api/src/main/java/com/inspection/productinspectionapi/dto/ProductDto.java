package com.inspection.productinspectionapi.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class ProductDto {
    private final Long id;
    private final String name;
    private final String manufacturer;
    private final String serialNumber;
    private final String countryOrigin;
    private final String description;
}

