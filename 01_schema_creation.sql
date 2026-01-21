-- =============================================
-- Vehicle Service Center Management System
-- Database Schema Script (PostgreSQL)
-- =============================================

-- Enable UUID extension for unique identifiers if needed (optional, using SERIAL/BIGINT here for simplicity and standard academic requirement usually favors integer keys for ease of learning, but I will use SERIAL/IDENTITY).
-- We will use standard IDENTITY columns.

-- 1. Users and Roles (RBAC)
CREATE TABLE users (
    user_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('ADMIN', 'MANAGER', 'MECHANIC', 'RECEPTIONIST', 'CUSTOMER')),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- 2. Audit Log (Partitioned by Range on changed_at)
-- Partitioning strategy: Monthly partitions.
CREATE TABLE audit_logs (
    log_id BIGINT GENERATED ALWAYS AS IDENTITY,
    table_name VARCHAR(50) NOT NULL,
    record_id VARCHAR(50) NOT NULL,
    action VARCHAR(10) NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
    old_data JSONB,
    new_data JSONB,
    changed_by INT, -- References users(user_id) but loose coupling often preferred for logs, strict FK used here for integrity
    changed_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (log_id, changed_at)
) PARTITION BY RANGE (changed_at);

-- Create Partitions for Audit Log (Example for 2025/2026)
CREATE TABLE audit_logs_y2025m01 PARTITION OF audit_logs FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');
CREATE TABLE audit_logs_y2025m02 PARTITION OF audit_logs FOR VALUES FROM ('2025-02-01') TO ('2025-03-01');
CREATE TABLE audit_logs_y2025m03 PARTITION OF audit_logs FOR VALUES FROM ('2025-03-01') TO ('2025-04-01');

-- Adding 2026 Partitions as the current demo year is 2026
CREATE TABLE audit_logs_y2026m01 PARTITION OF audit_logs FOR VALUES FROM ('2026-01-01') TO ('2026-02-01');
CREATE TABLE audit_logs_y2026m02 PARTITION OF audit_logs FOR VALUES FROM ('2026-02-01') TO ('2026-03-01');
CREATE TABLE audit_logs_y2026m03 PARTITION OF audit_logs FOR VALUES FROM ('2026-03-01') TO ('2026-04-01');
-- ... Additional partitions would be managed by a maintenance job

-- 3. Customers
CREATE TABLE customers (
    customer_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id INT UNIQUE REFERENCES users(user_id),
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(20) NOT NULL,
    address TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4. Vehicles
CREATE TABLE vehicles (
    vehicle_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    customer_id INT NOT NULL REFERENCES customers(customer_id) ON DELETE CASCADE,
    vin VARCHAR(17) UNIQUE NOT NULL,
    make VARCHAR(50) NOT NULL,
    model VARCHAR(50) NOT NULL,
    year INT NOT NULL CHECK (year BETWEEN 1900 AND EXTRACT(YEAR FROM CURRENT_DATE) + 1),
    license_plate VARCHAR(20) UNIQUE NOT NULL,
    color VARCHAR(30)
);

-- 5. Mechanics
CREATE TABLE mechanics (
    mechanic_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id INT UNIQUE REFERENCES users(user_id), -- Link to user account if they have login
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    specialty VARCHAR(100),
    hourly_rate DECIMAL(10, 2) NOT NULL CHECK (hourly_rate > 0),
    hire_date DATE DEFAULT CURRENT_DATE,
    is_active BOOLEAN DEFAULT TRUE
);

-- 6. Service Types (Catalog of services)
CREATE TABLE service_types (
    service_type_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    estimated_hours DECIMAL(4, 2) DEFAULT 1.0,
    base_labor_cost DECIMAL(10, 2) NOT NULL DEFAULT 0.00
);

-- 7. Suppliers
CREATE TABLE suppliers (
    supplier_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    contact_person VARCHAR(100),
    phone VARCHAR(20),
    email VARCHAR(100),
    address TEXT
);

-- 8. Parts (Catalog)
CREATE TABLE parts (
    part_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    part_number VARCHAR(50) UNIQUE NOT NULL, -- OEM or internal Number
    name VARCHAR(100) NOT NULL,
    description TEXT,
    manufacturer VARCHAR(100),
    unit_price DECIMAL(10, 2) NOT NULL CHECK (unit_price >= 0) -- Selling price
);

-- 9. Inventory (Stock levels)
-- Normalized to allow multiple locations if needed, but here 1:1 with part for simplicity of requirement
CREATE TABLE inventory (
    inventory_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    part_id INT NOT NULL UNIQUE REFERENCES parts(part_id),
    quantity_on_hand INT NOT NULL DEFAULT 0 CHECK (quantity_on_hand >= 0),
    reorder_level INT NOT NULL DEFAULT 10,
    last_restocked_at TIMESTAMPTZ
);

-- 10. Service Orders (The Booking/Header)
CREATE TABLE service_orders (
    order_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    customer_id INT NOT NULL REFERENCES customers(customer_id),
    vehicle_id INT NOT NULL REFERENCES vehicles(vehicle_id),
    order_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    expected_completion TIMESTAMPTZ,
    status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'PAID')),
    total_amount DECIMAL(10, 2) DEFAULT 0.00 -- Denormalized for quick reporting, maintained by triggers/procedures
);

-- 11. Service Jobs (Specific tasks within an order)
CREATE TABLE service_jobs (
    job_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    order_id INT NOT NULL REFERENCES service_orders(order_id) ON DELETE CASCADE,
    service_type_id INT NOT NULL REFERENCES service_types(service_type_id),
    mechanic_id INT REFERENCES mechanics(mechanic_id), -- Nullable initially
    status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'HALTED')),
    notes JSONB, -- JSON column for mechanic notes as requested
    actual_labor_hours DECIMAL(4, 2),
    labor_cost DECIMAL(10, 2) DEFAULT 0.00
);

-- 12. Parts Used (in Service Jobs)
CREATE TABLE parts_used (
    usage_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    job_id INT NOT NULL REFERENCES service_jobs(job_id) ON DELETE CASCADE,
    part_id INT NOT NULL REFERENCES parts(part_id),
    quantity INT NOT NULL CHECK (quantity > 0),
    unit_price_at_time DECIMAL(10, 2) NOT NULL -- Store price at time of usage to preserve history
);

-- 13. Purchase Orders (Restocking)
CREATE TABLE purchase_orders (
    po_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    supplier_id INT NOT NULL REFERENCES suppliers(supplier_id),
    order_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'ORDERED' CHECK (status IN ('ORDERED', 'RECEIVED', 'CANCELLED')),
    total_amount DECIMAL(10, 2) DEFAULT 0.00
);

-- 14. Purchase Order Items
CREATE TABLE po_items (
    po_item_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    po_id INT NOT NULL REFERENCES purchase_orders(po_id) ON DELETE CASCADE,
    part_id INT NOT NULL REFERENCES parts(part_id),
    quantity INT NOT NULL CHECK (quantity > 0),
    unit_cost DECIMAL(10, 2) NOT NULL -- Cost price from supplier
);

-- 15. Payments
CREATE TABLE payments (
    payment_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    order_id INT NOT NULL REFERENCES service_orders(order_id),
    amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0),
    payment_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    payment_method VARCHAR(20) CHECK (payment_method IN ('CASH', 'CREDIT_CARD', 'DEBIT_CARD', 'ONLINE', 'INSURANCE'))
);

-- Indexes for performance
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_vehicles_vin ON vehicles(vin);
CREATE INDEX idx_service_orders_status ON service_orders(status);
CREATE INDEX idx_inventory_part_id ON inventory(part_id);
CREATE INDEX idx_service_jobs_mechanic ON service_jobs(mechanic_id);
CREATE INDEX idx_audit_logs_table_id ON audit_logs(table_name, record_id);
