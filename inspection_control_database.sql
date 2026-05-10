-- Run as a privileged user (e.g. root) in MySQL Workbench/CLI.

DROP DATABASE IF EXISTS inspection_control;
CREATE DATABASE inspection_control
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE inspection_control;

CREATE TABLE product (
  id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name            VARCHAR(255)    NOT NULL,
  manufacturer    VARCHAR(255)    NOT NULL,
  serial_number   VARCHAR(100)    NULL,
  country_origin  VARCHAR(120)    NOT NULL,
  description     TEXT            NULL,
  created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_product_name (name),
  KEY idx_product_manufacturer (manufacturer),
  UNIQUE KEY uq_product_serial (serial_number)
);

CREATE TABLE inspection_body (
  id             BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name           VARCHAR(255)    NOT NULL,
  inspectorate   ENUM('FBiH', 'RS', 'Brcko') NOT NULL,
  jurisdiction   ENUM('Market', 'HealthSanitary') NOT NULL,
  contact_person VARCHAR(255)    NOT NULL,
  created_at     TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_inspection_body_name (name),
  KEY idx_inspection_body_inspectorate (inspectorate),
  KEY idx_inspection_body_jurisdiction (jurisdiction)
);

CREATE TABLE inspection_control (
  id                  BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  inspection_datetime DATETIME        NOT NULL,
  inspection_body_id  BIGINT UNSIGNED NOT NULL,
  product_id          BIGINT UNSIGNED NOT NULL,
  results             TEXT            NOT NULL,
  product_safe        BOOLEAN         NOT NULL,
  created_at          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_control_body_date (inspection_body_id, inspection_datetime),
  KEY idx_control_product (product_id),
  CONSTRAINT fk_control_body
    FOREIGN KEY (inspection_body_id) REFERENCES inspection_body(id)
    ON UPDATE RESTRICT ON DELETE RESTRICT,
  CONSTRAINT fk_control_product
    FOREIGN KEY (product_id) REFERENCES product(id)
    ON UPDATE RESTRICT ON DELETE RESTRICT
);

DELIMITER $$

CREATE TRIGGER trg_control_no_future_inspection_insert
BEFORE INSERT ON inspection_control
FOR EACH ROW
BEGIN
  IF NEW.inspection_datetime > NOW() THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'inspection_datetime cannot be in the future';
  END IF;
END$$

CREATE TRIGGER trg_control_no_future_inspection_update
BEFORE UPDATE ON inspection_control
FOR EACH ROW
BEGIN
  IF NEW.inspection_datetime > NOW() THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'inspection_datetime cannot be in the future';
  END IF;
END$$

DELIMITER ;

