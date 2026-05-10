package com.inspection.productinspectionapi.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.inspection.productinspectionapi.entity.Product;
import com.inspection.productinspectionapi.exception.ConflictException;
import com.inspection.productinspectionapi.exception.NotFoundException;
import com.inspection.productinspectionapi.repository.InspectionControlRepository;
import com.inspection.productinspectionapi.repository.ProductRepository;

@Service
public class ProductService {
    private final ProductRepository repo;
    private final InspectionControlRepository controlRepo;

    public ProductService(ProductRepository repo, InspectionControlRepository controlRepo) {
        this.repo = repo;
        this.controlRepo = controlRepo;
    }

    public List<Product> findAll() {
        return repo.findAll();
    }

    public Product findById(Long id) {
        return repo.findById(id).orElseThrow(() -> new NotFoundException("Proizvod nije pronađen: " + id));
    }

    public Product create(Product product) {
        product.setId(null);
        return repo.save(product);
    }

    public Product update(Long id, Product product) {
        Product existing = findById(id);
        existing.setName(product.getName());
        existing.setManufacturer(product.getManufacturer());
        existing.setSerialNumber(product.getSerialNumber());
        existing.setCountryOrigin(product.getCountryOrigin());
        existing.setDescription(product.getDescription());
        return repo.save(existing);
    }

    public void delete(Long id) {
        if (!repo.existsById(id)) {
            throw new NotFoundException("Proizvod nije pronađen: " + id);
        }
        if (controlRepo.existsByProductId(id)) {
            throw new ConflictException("Nije moguće obrisati proizvod: on je referenciran u jednom ili više kontrola.");
        }
        repo.deleteById(id);
    }
}

