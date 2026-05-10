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

import com.inspection.productinspectionapi.dto.ProductDto;
import com.inspection.productinspectionapi.entity.Product;
import com.inspection.productinspectionapi.mapper.DtoMapper;
import com.inspection.productinspectionapi.service.ProductService;

@RestController
@RequestMapping("/api/products")
public class ProductController {
    private final ProductService service;

    public ProductController(ProductService service) {
        this.service = service;
    }

    @GetMapping("/fetch")
    public List<ProductDto> list() {
        return service.findAll().stream().map(DtoMapper::toDto).toList();
    }

    @GetMapping("/fetch/{id}")
    public ProductDto get(@PathVariable Long id) {
        return DtoMapper.toDto(service.findById(id));
    }

    @PostMapping("/create")
    public ProductDto create(@Valid @RequestBody Product product) {
        return DtoMapper.toDto(service.create(product));
    }

    @PutMapping("/update/{id}")
    public ProductDto update(@PathVariable Long id, @Valid @RequestBody Product product) {
        return DtoMapper.toDto(service.update(id, product));
    }

    @DeleteMapping("/delete/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}

