package com.inspection.productinspectionapi.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.inspection.productinspectionapi.entity.InspectionControl;

public interface InspectionControlRepository extends JpaRepository<InspectionControl, Long> {
    boolean existsByProductId(Long productId);

    boolean existsByInspectionBodyId(Long inspectionBodyId);

    @Query("""
            SELECT c FROM InspectionControl c
            WHERE c.inspectionBody.id = :inspectionBodyId
              AND c.inspectionDateTime BETWEEN :from AND :to
            ORDER BY c.inspectionDateTime ASC
            """)
    List<InspectionControl> findReportControls(
            @Param("inspectionBodyId") Long inspectionBodyId,
            @Param("from") LocalDateTime from,
            @Param("to") LocalDateTime to
    );
}

