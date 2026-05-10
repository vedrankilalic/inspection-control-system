package com.inspection.productinspectionapi.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.inspection.productinspectionapi.dto.InspectionControlDetailsDto;
import com.inspection.productinspectionapi.dto.InspectionControlDto;
import com.inspection.productinspectionapi.entity.InspectionControl;
import com.inspection.productinspectionapi.exception.NotFoundException;
import com.inspection.productinspectionapi.mapper.DtoMapper;
import com.inspection.productinspectionapi.repository.InspectionBodyRepository;
import com.inspection.productinspectionapi.repository.InspectionControlRepository;
import com.inspection.productinspectionapi.repository.ProductRepository;

@Service
public class InspectionControlService {
    private final InspectionControlRepository controlRepo;
    private final InspectionBodyRepository bodyRepo;
    private final ProductRepository productRepo;

    public InspectionControlService(
            InspectionControlRepository controlRepo,
            InspectionBodyRepository bodyRepo,
            ProductRepository productRepo
    ) {
        this.controlRepo = controlRepo;
        this.bodyRepo = bodyRepo;
        this.productRepo = productRepo;
    }


    public List<InspectionControl> findAll() {
        return controlRepo.findAll();
    }

    public InspectionControl findById(Long id) {
        return controlRepo.findById(id).orElseThrow(() -> new NotFoundException("Inspekcijska kontrola nije pronađena: " + id));
    }

    @Transactional(readOnly = true)
    public List<InspectionControlDto> findAllDto() {
        return controlRepo.findAll().stream().map(DtoMapper::toDto).toList();
    }

    @Transactional(readOnly = true)
    public InspectionControlDetailsDto findDetailsDtoById(Long id) {
        InspectionControl c = findById(id);
        return DtoMapper.toDetailsDto(c);
    }

    public InspectionControl create(InspectionControl control) {
        control.setId(null);
        validateRefs(control);
        return controlRepo.save(control);
    }

    @Transactional
    public InspectionControlDto createDto(InspectionControl control) {
        return DtoMapper.toDto(create(control));
    }

    public InspectionControl update(Long id, InspectionControl control) {
        InspectionControl existing = findById(id);
        existing.setInspectionDateTime(control.getInspectionDateTime());
        existing.setResults(control.getResults());
        existing.setProductSafe(control.getProductSafe());

        existing.setInspectionBody(control.getInspectionBody());
        existing.setProduct(control.getProduct());
        validateRefs(existing);

        return controlRepo.save(existing);
    }

    @Transactional
    public InspectionControlDto updateDto(Long id, InspectionControl control) {
        return DtoMapper.toDto(update(id, control));
    }

    public void delete(Long id) {
        if (!controlRepo.existsById(id)) {
            throw new NotFoundException("Inspekcijska kontrola nije pronađena: " + id);
        }
        controlRepo.deleteById(id);
    }

    public List<InspectionControl> reportControls(Long inspectionBodyId, LocalDateTime from, LocalDateTime to) {
        return controlRepo.findReportControls(
                inspectionBodyId,
                from,
                to
        );
    }

    @Transactional(readOnly = true)
    public List<InspectionControlDto> reportControlsDto(Long inspectionBodyId, LocalDateTime from, LocalDateTime to) {
        return reportControls(inspectionBodyId, from, to).stream().map(DtoMapper::toDto).toList();
    }

    private void validateRefs(InspectionControl control) {
        Long bodyId = control.getInspectionBody() != null ? control.getInspectionBody().getId() : null;
        if (bodyId == null || !bodyRepo.existsById(bodyId)) {
            throw new NotFoundException("Inspekcijsko tijelo nije pronađeno: " + bodyId);
        }

        Long productId = control.getProduct() != null ? control.getProduct().getId() : null;
        if (productId == null || !productRepo.existsById(productId)) {
            throw new NotFoundException("Proizvod nije pronađen: " + productId);
        }
    }
}

