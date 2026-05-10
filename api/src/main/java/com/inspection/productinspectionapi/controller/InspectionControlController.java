package com.inspection.productinspectionapi.controller;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.inspection.productinspectionapi.dto.InspectionControlDetailsDto;
import com.inspection.productinspectionapi.dto.InspectionControlDto;
import com.inspection.productinspectionapi.dto.InspectionControlUpsertRequest;
import com.inspection.productinspectionapi.entity.InspectionBody;
import com.inspection.productinspectionapi.entity.InspectionControl;
import com.inspection.productinspectionapi.entity.Product;
import com.inspection.productinspectionapi.exception.NotFoundException;
import com.inspection.productinspectionapi.repository.InspectionBodyRepository;
import com.inspection.productinspectionapi.repository.ProductRepository;
import com.inspection.productinspectionapi.service.InspectionControlService;

@RestController
@RequestMapping("/api/inspection-controls")
public class InspectionControlController {
    private final InspectionControlService service;
    private final InspectionBodyRepository bodyRepo;
    private final ProductRepository productRepo;

    public InspectionControlController(
            InspectionControlService service,
            InspectionBodyRepository bodyRepo,
            ProductRepository productRepo
    ) {
        this.service = service;
        this.bodyRepo = bodyRepo;
        this.productRepo = productRepo;
    }

    @GetMapping("/fetch")
    public List<InspectionControlDto> list() {
        return service.findAllDto();
    }

    @GetMapping("/fetch/{id}")
    public InspectionControlDetailsDto get(@PathVariable Long id) {
        return service.findDetailsDtoById(id);
    }

    @PostMapping("/create")
    public InspectionControlDto create(@Valid @RequestBody InspectionControlUpsertRequest req) {
        if (req.getInspectionDateTime().isAfter(LocalDateTime.now())) {
            throw new IllegalArgumentException("Datum inspekcijske kontrole ne smije biti u budućnosti.");
        }

        InspectionBody body = bodyRepo.findById(req.getInspectionBodyId())
                .orElseThrow(() -> new NotFoundException("Inspekcijsko tijelo nije pronađeno: " + req.getInspectionBodyId()));
        Product product = productRepo.findById(req.getProductId())
                .orElseThrow(() -> new NotFoundException("Proizvod nije pronađen: " + req.getProductId()));

        InspectionControl c = new InspectionControl();
        c.setInspectionDateTime(req.getInspectionDateTime());
        c.setInspectionBody(body);
        c.setProduct(product);
        c.setResults(req.getResults());
        c.setProductSafe(req.getProductSafe());
        return service.createDto(c);
    }

    @PutMapping("/update/{id}")
    public InspectionControlDto update(@PathVariable Long id, @Valid @RequestBody InspectionControlUpsertRequest req) {
        if (req.getInspectionDateTime().isAfter(LocalDateTime.now())) {
            throw new IllegalArgumentException("Datum inspekcijske kontrole ne smije biti u budućnosti.");
        }

        InspectionBody body = bodyRepo.findById(req.getInspectionBodyId())
                .orElseThrow(() -> new NotFoundException("Inspekcijsko tijelo nije pronađeno: " + req.getInspectionBodyId()));
        Product product = productRepo.findById(req.getProductId())
                .orElseThrow(() -> new NotFoundException("Proizvod nije pronađen: " + req.getProductId()));

        InspectionControl c = new InspectionControl();
        c.setInspectionDateTime(req.getInspectionDateTime());
        c.setInspectionBody(body);
        c.setProduct(product);
        c.setResults(req.getResults());
        c.setProductSafe(req.getProductSafe());
        return service.updateDto(id, c);
    }

    @DeleteMapping("/delete/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }

    @GetMapping("/report")
    public List<InspectionControlDto> report(
            @RequestParam Long inspectionBodyId,
            @RequestParam LocalDateTime from,
            @RequestParam LocalDateTime to
    ) {
        return service.reportControlsDto(inspectionBodyId, from, to);
    }
}

