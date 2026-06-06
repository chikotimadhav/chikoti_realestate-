-- ============================================================
-- CHIKOTI REAL ESTATE - UNIFIED DATABASE SCHEMA
-- ============================================================

CREATE DATABASE IF NOT EXISTS chikoti_realestate;
USE chikoti_realestate;

-- USERS TABLE (sellers, buyers, admins)
CREATE TABLE users (
    id          VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name        VARCHAR(100) NOT NULL,
    email       VARCHAR(150) UNIQUE NOT NULL,
    phone       VARCHAR(20),
    password    VARCHAR(255) NOT NULL,
    role        ENUM('admin','seller','buyer') NOT NULL DEFAULT 'buyer',
    avatar_url  VARCHAR(500),
    is_verified BOOLEAN DEFAULT FALSE,
    is_active   BOOLEAN DEFAULT TRUE,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- PROPERTIES TABLE
CREATE TABLE properties (
    id              VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    seller_id       VARCHAR(36) NOT NULL,
    title           VARCHAR(200) NOT NULL,
    land_type       ENUM('Agriculture','Commercial','Residential') NOT NULL,
    listing_type    ENUM('Sale','Rent','Lease') NOT NULL DEFAULT 'Sale',
    price           DECIMAL(15,2) NOT NULL,
    location        VARCHAR(500) NOT NULL,
    lat             DECIMAL(10,8),
    lng             DECIMAL(11,8),
    description     TEXT,
    contact_number  VARCHAR(20),
    whatsapp_number VARCHAR(20),
    status          ENUM('pending','approved','rejected') DEFAULT 'pending',
    is_featured     BOOLEAN DEFAULT FALSE,
    views           INT DEFAULT 0,
    -- Agriculture fields
    acres           DECIMAL(10,2),
    soil_type       VARCHAR(50),
    water_source    VARCHAR(50),
    current_crop    VARCHAR(100),
    crop_yield      DECIMAL(5,2),
    electricity     VARCHAR(50),
    fencing         VARCHAR(50),
    agri_facilities JSON,
    -- Commercial fields
    built_area      DECIMAL(10,2),
    floor           VARCHAR(50),
    frontage        DECIMAL(8,2),
    business_type   VARCHAR(100),
    parking         VARCHAR(30),
    footfall        ENUM('Low','Medium','High'),
    landmarks       TEXT,
    comm_amenities  JSON,
    -- Residential fields
    area_sqft       DECIMAL(10,2),
    bedrooms        TINYINT,
    bathrooms       TINYINT,
    furnishing      ENUM('Unfurnished','Semi-furnished','Fully Furnished'),
    res_floor       VARCHAR(50),
    res_amenities   JSON,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE
);

-- PROPERTY IMAGES TABLE
CREATE TABLE property_images (
    id          VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    property_id VARCHAR(36) NOT NULL,
    image_url   VARCHAR(500) NOT NULL,
    is_primary  BOOLEAN DEFAULT FALSE,
    sort_order  INT DEFAULT 0,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
);

-- INQUIRIES TABLE
CREATE TABLE inquiries (
    id          VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    property_id VARCHAR(36) NOT NULL,
    buyer_name  VARCHAR(100) NOT NULL,
    buyer_email VARCHAR(150) NOT NULL,
    buyer_phone VARCHAR(20) NOT NULL,
    message     TEXT,
    status      ENUM('new','read','replied') DEFAULT 'new',
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
);

-- FAVORITES TABLE
CREATE TABLE favorites (
    id          VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id     VARCHAR(36) NOT NULL,
    property_id VARCHAR(36) NOT NULL,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_favorite (user_id, property_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
);

-- SESSIONS TABLE
CREATE TABLE sessions (
    id         VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id    VARCHAR(36) NOT NULL,
    token      VARCHAR(500) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- SEED: Default admin user (password: admin@chikoti123)
INSERT INTO users (id, name, email, password, role, is_verified)
VALUES ('admin-001', 'Chikoti Admin', 'admin@chikotirealestate.com',
        '$2b$10$examplehashedpassword', 'admin', TRUE);

-- INDEXES
CREATE INDEX idx_properties_status   ON properties(status);
CREATE INDEX idx_properties_type     ON properties(land_type);
CREATE INDEX idx_properties_seller   ON properties(seller_id);
CREATE INDEX idx_inquiries_property  ON inquiries(property_id);
CREATE INDEX idx_favorites_user      ON favorites(user_id);
