package com.inspection.productinspectionapi.dto;

import com.inspection.productinspectionapi.enums.Inspectorate;
import com.inspection.productinspectionapi.enums.Jurisdiction;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class InspectionBodyDto {
    private final Long id;
    private final String name;
    private final Inspectorate inspectorate;
    private final Jurisdiction jurisdiction;
    private final String contactPerson;
}

