CREATE DATABASE IF NOT EXISTS folios_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE folios_db;

CREATE TABLE `roles` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL UNIQUE,
  `description` TEXT,
  `is_active` BOOLEAN DEFAULT TRUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  KEY `idx_name` (`name`)
);

CREATE TABLE `sections` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL UNIQUE,
  `description` TEXT,
  `is_active` BOOLEAN DEFAULT TRUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_name` (`name`)
);

CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `full_name` VARCHAR(255) NOT NULL,
  `role_id` INT NOT NULL,
  `section_id` INT NULL,
  `is_active` BOOLEAN DEFAULT TRUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`),
  FOREIGN KEY (`section_id`) REFERENCES `sections`(`id`),
  KEY `idx_email` (`email`),
  KEY `idx_section_id` (`section_id`),
  KEY `idx_role_id` (`role_id`)
);

CREATE TABLE `clients` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `contact_email` VARCHAR(255),
  `phone` VARCHAR(20),
  `address` TEXT,
  `is_active` BOOLEAN DEFAULT TRUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_name` (`name`)
);

CREATE TABLE `projects` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `client_id` INT NOT NULL,
  `salesman_id` INT NOT NULL,
  `description` TEXT,
  `is_active` BOOLEAN DEFAULT TRUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`),
  FOREIGN KEY (`salesman_id`) REFERENCES `users`(`id`),
  KEY `idx_client_id` (`client_id`),
  KEY `idx_salesman_id` (`salesman_id`)
);

CREATE TABLE `folios` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `folio_number` VARCHAR(100) NOT NULL,
  `project_id` INT NOT NULL,
  `quantity` INT NOT NULL,
  `due_date` DATE ,
  `status` ENUM('ACTIVE', 'COMPLETED', 'CANCELLED') DEFAULT 'ACTIVE',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`),
  KEY `idx_folio_number` (`folio_number`),
  KEY `idx_project_id` (`project_id`),
  KEY `idx_status` (`status`)
);

CREATE TABLE `garments` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `garment_description` TEXT NOT NULL,
  `garment_code` VARCHAR(100) NOT NULL UNIQUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_garment_code` (`garment_code`)
);

CREATE TABLE `folio_garments` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `folio_id` INT NOT NULL,
  `garment_id` INT NOT NULL,
  `quantity` INT NOT NULL,
  `route_id` INT NOT NULL,
  `status` ENUM('PENDING', 'IN_PROGRESS', 'COMPLETED') DEFAULT 'PENDING',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`folio_id`) REFERENCES `folios`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`garment_id`) REFERENCES `garments`(`id`) ON DELETE CASCADE,
  KEY `idx_folio_id` (`folio_id`),
  KEY `idx_garment_id` (`garment_id`)
);

CREATE TABLE `routes` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL UNIQUE,
  `description` TEXT,
  `is_active` BOOLEAN DEFAULT TRUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE `route_sections` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `route_id` INT NOT NULL,
  `section_id` INT NOT NULL,
  `sequence_order` INT NOT NULL,
  `is_active` BOOLEAN DEFAULT TRUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`route_id`) REFERENCES `routes`(`id`),
  FOREIGN KEY (`section_id`) REFERENCES `sections`(`id`),
  UNIQUE KEY `unique_route_section_order` (`route_id`, `sequence_order`),
  KEY `idx_route_id` (`route_id`),
  KEY `idx_section_id` (`section_id`)
);

CREATE TABLE `processes` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `section_id` INT NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `type` ENUM('POR_CANTIDAD', 'UNITARIO') NOT NULL,
  `is_active` BOOLEAN DEFAULT TRUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`section_id`) REFERENCES `sections`(`id`),
  KEY `idx_section_id` (`section_id`),
  KEY `idx_type` (`type`)
);

CREATE TABLE `garments_folio_routes` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `garments_folio_id` INT NOT NULL,
  `route_id` INT NOT NULL,
  `current_route_section_id` INT NULL,
  `status` ENUM('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED') DEFAULT 'NOT_STARTED',
  `started_at` DATETIME NULL,
  `completed_at` DATETIME NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`garments_folio_id`) REFERENCES `folio_garments`(`id`),
  FOREIGN KEY (`route_id`) REFERENCES `routes`(`id`),
  FOREIGN KEY (`current_route_section_id`) REFERENCES `route_sections`(`id`),
  KEY `idx_garments_folio_id` (`garments_folio_id`),
  KEY `idx_route_id` (`route_id`),
  KEY `idx_status` (`status`)
);

CREATE TABLE `folio_processes` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `folio_id` INT NOT NULL,
  `garment_id` INT NOT NULL,
  `process_id` INT NOT NULL,
  `route_section_id` INT NOT NULL,
  `status` ENUM('NOT_STARTED', 'IN_PROGRESS', 'PAUSED', 'COMPLETED') DEFAULT 'NOT_STARTED',
  `total_quantity` INT NOT NULL,
  `completed_quantity` INT DEFAULT 0,
  `started_at` DATETIME NULL,
  `completed_at` DATETIME NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`folio_id`) REFERENCES `folios`(`id`),
  FOREIGN KEY (`garment_id`) REFERENCES `garments`(`id`),
  FOREIGN KEY (`process_id`) REFERENCES `processes`(`id`),
  FOREIGN KEY (`route_section_id`) REFERENCES `route_sections`(`id`),
  KEY `idx_folio_id` (`folio_id`),
  KEY `idx_garment_id` (`garment_id`),
  KEY `idx_process_id` (`process_id`),
  KEY `idx_status` (`status`),
  KEY `idx_folio_process_status` (`folio_id`, `status`)
);

CREATE TABLE `process_progress` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `folio_process_id` INT NOT NULL,
  `quantity_completed` INT NOT NULL,
  `updated_by_user_id` INT NOT NULL,
  `reason` VARCHAR(255) NOT NULL,
  `comments` TEXT,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`folio_process_id`) REFERENCES `folio_processes`(`id`),
  FOREIGN KEY (`updated_by_user_id`) REFERENCES `users`(`id`),
  KEY `idx_folio_process_id` (`folio_process_id`),
  KEY `idx_updated_at` (`updated_at`)
);

CREATE TABLE `delivery_dates` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `garment_folio_route_id` INT NOT NULL,
  `due_date` DATE NOT NULL,
  `notes` TEXT,
  `is_active` BOOLEAN DEFAULT TRUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`garment_folio_route_id`) REFERENCES `garments_folio_routes`(`id`),
  KEY `idx_garment_folio_route_id` (`garment_folio_route_id`),
  KEY `idx_due_date` (`due_date`)
);

CREATE TABLE `delivery_date_history` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `garment_folio_route_id` INT NOT NULL,
  `old_due_date` DATE NOT NULL,
  `new_due_date` DATE NOT NULL,
  `changed_by_user_id` INT NOT NULL,
  `reason` VARCHAR(255) NOT NULL,
  `changed_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`garment_folio_route_id`) REFERENCES `garments_folio_routes`(`id`),
  FOREIGN KEY (`changed_by_user_id`) REFERENCES `users`(`id`),
  KEY `idx_garment_folio_route_id` (`garment_folio_route_id`),
  KEY `idx_changed_at` (`changed_at`)
);

CREATE TABLE `audit_log` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `action` ENUM('STATE_CHANGE', 'PROGRESS_UPDATE', 'DATE_CHANGE', 'CREATED', 'UPDATED', 'DELETED') NOT NULL,
  `entity_type` VARCHAR(100) NOT NULL,
  `entity_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  `old_value` LONGTEXT NULL,
  `new_value` LONGTEXT NULL,
  `description` TEXT NOT NULL,
  `timestamp` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`),
  KEY `idx_entity` (`entity_type`, `entity_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_timestamp` (`timestamp`),
  KEY `idx_action` (`action`)
);
