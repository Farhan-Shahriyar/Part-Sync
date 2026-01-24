-- =============================================
-- Vehicle Service Center Management System
-- Seed Data Script
-- =============================================

-- 0. Clean Slate
TRUNCATE TABLE 
    parts_used, 
    service_jobs, 
    payments,
    service_orders, 
    po_items, 
    purchase_orders, 
    inventory, 
    vehicles, 
    customers, 
    mechanics, 
    users, 
    service_types, 
    suppliers, 
    parts,
    service_requirements,
    audit_logs
RESTART IDENTITY CASCADE;

-- 1. Users
INSERT INTO users (username, password_hash, role) VALUES
('admin', 'hash_admin_123', 'ADMIN')
ON CONFLICT (username) DO NOTHING;

-- 5. Service Types (System Config)
INSERT INTO service_types (name, description, estimated_hours, base_labor_cost) VALUES
('Oil Change', 'Standard oil and filter change', 0.5, 30.00),
('Brake Pad Replacement', 'Front or rear brake pads', 1.5, 90.00),
('General Inspection', 'Multi-point safety inspection', 1.0, 60.00),
('Engine Tune-up', 'Spark plugs, air filter, system check', 2.0, 120.00)
ON CONFLICT (name) DO NOTHING;

-- 6. Suppliers (Needed for Restocking)
INSERT INTO suppliers (name, contact_person, phone, email) VALUES
('AutoParts Warehouse', 'Jim Halpert', '555-9000', 'orders@autopartswarehouse.com'),
('Global Tyres Inc', 'Pam Beesly', '555-9001', 'sales@globaltyres.com')
ON CONFLICT (name) DO NOTHING;

-- Note: No Parts, Inventory, Customers, Mechanics, or Orders.
-- Admin must create them manually.
