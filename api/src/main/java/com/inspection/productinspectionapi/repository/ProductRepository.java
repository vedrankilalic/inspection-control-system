package com.inspection.productinspectionapi.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.inspection.productinspectionapi.entity.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {}

