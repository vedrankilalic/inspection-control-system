package com.inspection.productinspectionapi.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.inspection.productinspectionapi.entity.InspectionBody;
import com.inspection.productinspectionapi.exception.ConflictException;
import com.inspection.productinspectionapi.exception.NotFoundException;
import com.inspection.productinspectionapi.repository.InspectionBodyRepository;
import com.inspection.productinspectionapi.repository.InspectionControlRepository;

@Service
public class InspectionBodyService {
    private final InspectionBodyRepository repo;
    private final InspectionControlRepository controlRepo;

    public InspectionBodyService(InspectionBodyRepository repo, InspectionControlRepository controlRepo) {
        this.repo = repo;
        this.controlRepo = controlRepo;
    }

    public List<InspectionBody> findAll() {
        return repo.findAll();
    }

    public InspectionBody findById(Long id) {
        return repo.findById(id).orElseThrow(() -> new NotFoundException("Inspekcijsko tijelo nije pronađeno: " + id));
    }

    public InspectionBody create(InspectionBody body) {
        body.setId(null);
        return repo.save(body);
    }

    public InspectionBody update(Long id, InspectionBody body) {
        InspectionBody existing = findById(id);
        existing.setName(body.getName());
        existing.setInspectorate(body.getInspectorate());
        existing.setJurisdiction(body.getJurisdiction());
        existing.setContactPerson(body.getContactPerson());
        return repo.save(existing);
    }

    public void delete(Long id) {
        if (!repo.existsById(id)) {
            throw new NotFoundException("Inspekcijsko tijelo nije pronađeno: " + id);
        }
        if (controlRepo.existsByInspectionBodyId(id)) {
            throw new ConflictException("Nije moguće obrisati inspekcijsko tijelo: ono je referencirano u jednom ili više kontrola.");
        }
        repo.deleteById(id);
    }
}

