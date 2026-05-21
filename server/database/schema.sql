-- =========================================
-- USERS TABLE
-- =========================================

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================================
-- SITES TABLE 
-- =========================================
 
CREATE TABLE sites (
    id SERIAL PRIMARY KEY,
    site_name VARCHAR(150) NOT NULL,
    location TEXT,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================================
-- MATERIALS TABLE
-- =========================================

CREATE TABLE materials (
    id SERIAL PRIMARY KEY,
    site_id INTEGER REFERENCES sites(id) ON DELETE CASCADE,
    material_name VARCHAR(100) NOT NULL,
    unit VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================================
-- VENDORS TABLE
-- =========================================

CREATE TABLE vendors (
    id SERIAL PRIMARY KEY,
    vendor_name VARCHAR(150) NOT NULL,
    contact_number VARCHAR(20),
    email VARCHAR(150),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================================
-- MATERIAL PURCHASES TABLE
-- =========================================

CREATE TABLE material_purchases (
    id SERIAL PRIMARY KEY,
    material_id INTEGER REFERENCES materials(id) ON DELETE CASCADE,
    vendor_id INTEGER REFERENCES vendors(id) ON DELETE SET NULL,
    site_id INTEGER REFERENCES sites(id) ON DELETE CASCADE,

    quantity NUMERIC(10,2) NOT NULL,
    unit_cost NUMERIC(10,2) NOT NULL,
    transport_cost NUMERIC(10,2) DEFAULT 0,
    total_cost NUMERIC(12,2) NOT NULL,

    purchase_date DATE NOT NULL,
    notes TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================================
-- MATERIAL USAGE TABLE
-- =========================================

CREATE TABLE material_usage (
    id SERIAL PRIMARY KEY,
    material_id INTEGER REFERENCES materials(id) ON DELETE CASCADE,
    site_id INTEGER REFERENCES sites(id) ON DELETE CASCADE,

    used_quantity NUMERIC(10,2) NOT NULL,
    usage_date DATE NOT NULL,
    notes TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================================
-- MATERIAL STOCK TABLE
-- =========================================

CREATE TABLE material_stock (
    id SERIAL PRIMARY KEY,
    material_id INTEGER REFERENCES materials(id) ON DELETE CASCADE,
    site_id INTEGER REFERENCES sites(id) ON DELETE CASCADE,

    total_received NUMERIC(10,2) DEFAULT 0,
    total_used NUMERIC(10,2) DEFAULT 0,
    remaining_stock NUMERIC(10,2) DEFAULT 0,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================================
-- VENDOR TRANSACTIONS TABLE
-- =========================================

CREATE TABLE vendor_transactions (
    id SERIAL PRIMARY KEY,
    vendor_id INTEGER REFERENCES vendors(id) ON DELETE CASCADE,
    material_purchase_id INTEGER REFERENCES material_purchases(id) ON DELETE CASCADE,

    transaction_date DATE NOT NULL,
    amount NUMERIC(12,2) NOT NULL,
    description TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================================
-- VENDOR PAYMENTS TABLE
-- =========================================

CREATE TABLE vendor_payments (
    id SERIAL PRIMARY KEY,
    vendor_id INTEGER REFERENCES vendors(id) ON DELETE CASCADE,

    total_amount NUMERIC(12,2) NOT NULL,
    paid_amount NUMERIC(12,2) DEFAULT 0,
    pending_amount NUMERIC(12,2) DEFAULT 0,

    payment_date DATE,
    payment_method VARCHAR(50),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================================
-- LABOURS TABLE
-- =========================================

CREATE TABLE labours (
    id SERIAL PRIMARY KEY,
    site_id INTEGER REFERENCES sites(id) ON DELETE CASCADE,

    labour_name VARCHAR(150) NOT NULL,
    contact_number VARCHAR(20),
    address TEXT,
    daily_wage NUMERIC(10,2) NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================================
-- ATTENDANCE TABLE
-- =========================================

CREATE TABLE attendance (
    id SERIAL PRIMARY KEY,
    labour_id INTEGER REFERENCES labours(id) ON DELETE CASCADE,
    site_id INTEGER REFERENCES sites(id) ON DELETE CASCADE,

    attendance_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'Present',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================================
-- WAGES TABLE
-- =========================================

CREATE TABLE wages (
    id SERIAL PRIMARY KEY,
    labour_id INTEGER REFERENCES labours(id) ON DELETE CASCADE,

    total_days INTEGER DEFAULT 0,
    rate_per_day NUMERIC(10,2) NOT NULL,
    total_amount NUMERIC(12,2) NOT NULL,

    wage_month VARCHAR(20),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================================
-- LABOUR PAYMENTS TABLE
-- =========================================

CREATE TABLE labour_payments (
    id SERIAL PRIMARY KEY,
    labour_id INTEGER REFERENCES labours(id) ON DELETE CASCADE,

    total_amount NUMERIC(12,2) NOT NULL,
    paid_amount NUMERIC(12,2) DEFAULT 0,
    pending_amount NUMERIC(12,2) DEFAULT 0,

    payment_date DATE,
    payment_method VARCHAR(50),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================================
-- CLIENTS TABLE
-- =========================================

CREATE TABLE clients (
    id SERIAL PRIMARY KEY,

    client_name VARCHAR(150) NOT NULL,
    contact_number VARCHAR(20),
    email VARCHAR(150),
    address TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================================
-- RECEIVABLES TABLE
-- =========================================

CREATE TABLE receivables (
    id SERIAL PRIMARY KEY,

    client_id INTEGER REFERENCES clients(id) ON DELETE CASCADE,
    site_id INTEGER REFERENCES sites(id) ON DELETE CASCADE,

    total_amount NUMERIC(12,2) NOT NULL,
    received_amount NUMERIC(12,2) DEFAULT 0,
    pending_amount NUMERIC(12,2) DEFAULT 0,

    due_date DATE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================================
-- PAYMENTS TABLE
-- =========================================

CREATE TABLE payments (
    id SERIAL PRIMARY KEY,

    client_id INTEGER REFERENCES clients(id) ON DELETE CASCADE,

    payment_amount NUMERIC(12,2) NOT NULL,
    payment_date DATE NOT NULL,
    payment_method VARCHAR(50),

    notes TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================================
-- EXPENSES TABLE
-- =========================================

CREATE TABLE expenses (
    id SERIAL PRIMARY KEY,

    site_id INTEGER REFERENCES sites(id) ON DELETE CASCADE,

    expense_type VARCHAR(100) NOT NULL,
    amount NUMERIC(12,2) NOT NULL,
    expense_date DATE NOT NULL,

    description TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================================
-- REPORTS TABLE
-- =========================================

CREATE TABLE reports (
    id SERIAL PRIMARY KEY,

    site_id INTEGER REFERENCES sites(id) ON DELETE CASCADE,

    report_type VARCHAR(100),
    generated_by INTEGER REFERENCES users(id) ON DELETE SET NULL,

    report_date DATE,
    file_url TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
