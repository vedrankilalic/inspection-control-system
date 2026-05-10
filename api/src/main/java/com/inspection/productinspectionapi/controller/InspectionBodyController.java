package com.inspection.productinspectionapi.controller;

import java.util.List;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.inspection.productinspectionapi.dto.InspectionBodyDto;
import com.inspection.productinspectionapi.entity.InspectionBody;
import com.inspection.productinspectionapi.mapper.DtoMapper;
import com.inspection.productinspectionapi.service.InspectionBodyService;

@RestController
@RequestMapping("/api/inspection-bodies")
public class InspectionBodyController {
    private final InspectionBodyService service;

    public InspectionBodyController(InspectionBodyService service) {
        this.service = service;
    }

    @GetMapping("/fetch")
    public List<InspectionBodyDto> list() {
        return service.findAll().stream().map(DtoMapper::toDto).toList();
    }

    @GetMapping("/fetch/{id}")
    public InspectionBodyDto get(@PathVariable Long id) {
        return DtoMapper.toDto(service.findById(id));
    }

    @PostMapping("/create")
    public InspectionBodyDto create(@Valid @RequestBody InspectionBody body) {
        return DtoMapper.toDto(service.create(body));
    }

    @PutMapping("/update/{id}")
    public InspectionBodyDto update(@PathVariable Long id, @Valid @RequestBody InspectionBody body) {
        return DtoMapper.toDto(service.update(id, body));
    }

    @DeleteMapping("/delete/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}

