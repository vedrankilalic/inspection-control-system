package com.inspection.productinspectionapi.mapper;

import com.inspection.productinspectionapi.dto.InspectionBodyDto;
import com.inspection.productinspectionapi.dto.InspectionControlDetailsDto;
import com.inspection.productinspectionapi.dto.InspectionControlDto;
import com.inspection.productinspectionapi.dto.ProductDto;
import com.inspection.productinspectionapi.entity.InspectionBody;
import com.inspection.productinspectionapi.entity.InspectionControl;
import com.inspection.productinspectionapi.entity.Product;

public final class DtoMapper {
    private DtoMapper() {}

    public static ProductDto toDto(Product p) {
        return ProductDto.builder()
                .id(p.getId())
                .name(p.getName())
                .manufacturer(p.getManufacturer())
                .serialNumber(p.getSerialNumber())
                .countryOrigin(p.getCountryOrigin())
                .description(p.getDescription())
                .build();
    }

    public static InspectionBodyDto toDto(InspectionBody b) {
        return InspectionBodyDto.builder()
                .id(b.getId())
                .name(b.getName())
                .inspectorate(b.getInspectorate())
                .jurisdiction(b.getJurisdiction())
                .contactPerson(b.getContactPerson())
                .build();
    }

    public static InspectionControlDto toDto(InspectionControl c) {
        return InspectionControlDto.builder()
                .id(c.getId())
                .inspectionDateTime(c.getInspectionDateTime())
                .inspectionBodyId(c.getInspectionBody().getId())
                .inspectionBodyName(c.getInspectionBody().getName())
                .productId(c.getProduct().getId())
                .productName(c.getProduct().getName())
                .productSafe(c.getProductSafe())
                .build();
    }

    public static InspectionControlDetailsDto toDetailsDto(InspectionControl c) {
        return InspectionControlDetailsDto.builder()
                .id(c.getId())
                .inspectionDateTime(c.getInspectionDateTime())
                .results(c.getResults())
                .productSafe(c.getProductSafe())
                .productId(c.getProduct().getId())
                .productName(c.getProduct().getName())
                .productSerialNumber(c.getProduct().getSerialNumber())
                .productCountryOrigin(c.getProduct().getCountryOrigin())
                .inspectionBodyId(c.getInspectionBody().getId())
                .inspectionBodyName(c.getInspectionBody().getName())
                .build();
    }
}

