package com.inspection.productinspectionapi.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import com.inspection.productinspectionapi.enums.Inspectorate;
import com.inspection.productinspectionapi.enums.Jurisdiction;

@Entity
@Table(name = "inspection_body")
@Getter
@Setter
@NoArgsConstructor
public class InspectionBody {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String name;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Inspectorate inspectorate;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Jurisdiction jurisdiction;

    @NotBlank
    @Column(name = "contact_person", nullable = false)
    private String contactPerson;
}

