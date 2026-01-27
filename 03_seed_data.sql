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
('admin', 'admin', 'ADMIN')
ON CONFLICT (username) DO NOTHING;

-- 2. Suppliers
INSERT INTO suppliers (name, contact_person, phone, email) VALUES
('AutoParts Warehouse', 'Jim Halpert', '555-0001', 'jim@autoparts.com'),
('Global Tyres Inc', 'Pam Beesly', '555-0002', 'pam@globaltyres.com');

-- 3. Service Types
INSERT INTO service_types (name, description, estimated_hours, base_labor_cost) VALUES
('Oil Change Service', 'Full oil change', 0.5, 30.00),
('Brake Service', 'Brake pads and rotors', 2.0, 100.00),
('Tire Service', 'Tire replacement and balancing', 1.0, 50.00),
('Battery Replacement', 'Battery swap and terminal cleaning', 0.5, 25.00),
('Engine Tune-Up', 'Spark plugs and filters', 1.5, 80.00);

-- 4. Parts
-- Supplier 1 (AutoParts Warehouse): Engine, Battery
-- Supplier 2 (Global Tyres Inc): Brakes, Tires
INSERT INTO parts (part_number, name, description, unit_price, supplier_id) VALUES
-- Oil Change
('ENG-OIL-001', 'Engine Oil', 'Synthetic 5W-30', 25.00, 1),
('OIL-FIL-001', 'Oil Filter', 'Standard Oil Filter', 10.00, 1),
('DRN-WSH-001', 'Drain Plug Washer', 'Copper Washer', 1.00, 1),

-- Brake Service
('BRK-PAD-001', 'Brake Pads', 'Ceramic Pads Set', 45.00, 2),
('BRK-FLD-001', 'Brake Fluid', 'DOT 4 Fluid', 12.00, 2),
('BRK-DSC-001', 'Brake Disc', 'Ventilated Rotor', 55.00, 2),

-- Tire Service
('TIRE-001', 'All-Season Tire', '205/55R16', 120.00, 2),
('WHL-WGT-001', 'Wheel Weight', 'Lead-free weight', 2.00, 2),
('VLV-STM-001', 'Valve Stem', 'Rubber valve stem', 3.00, 2),

-- Battery Service
('BAT-001', 'Car Battery', '12V 600CCA', 150.00, 1),
('BAT-TRM-001', 'Battery Terminal', 'Lead terminal clamp', 5.00, 1),
('TRM-GRS-001', 'Terminal Grease', 'Corrosion protection', 8.00, 1),

-- Tune Up
('SPK-PLG-001', 'Spark Plug', 'Iridium Plug', 15.00, 1),
('AIR-FIL-001', 'Air Filter', 'High flow filter', 20.00, 1),
('FUL-FIL-001', 'Fuel Filter', 'Inline fuel filter', 18.00, 1);

-- 5. Inventory (Stock 16 for all)
INSERT INTO inventory (part_id, quantity_on_hand, reorder_level, last_restocked_at)
SELECT part_id, 16, 5, NOW() FROM parts;

-- 6. Service Requirements
-- Oil Change Service (ID 1)
INSERT INTO service_requirements (service_type_id, part_id, quantity) VALUES
(1, (SELECT part_id FROM parts WHERE name = 'Engine Oil'), 1),
(1, (SELECT part_id FROM parts WHERE name = 'Oil Filter'), 1),
(1, (SELECT part_id FROM parts WHERE name = 'Drain Plug Washer'), 1);

-- Brake Service (ID 2)
INSERT INTO service_requirements (service_type_id, part_id, quantity) VALUES
(2, (SELECT part_id FROM parts WHERE name = 'Brake Pads'), 2),
(2, (SELECT part_id FROM parts WHERE name = 'Brake Fluid'), 1),
(2, (SELECT part_id FROM parts WHERE name = 'Brake Disc'), 2);

-- Tire Service (ID 3)
INSERT INTO service_requirements (service_type_id, part_id, quantity) VALUES
(3, (SELECT part_id FROM parts WHERE name = 'All-Season Tire'), 4),
(3, (SELECT part_id FROM parts WHERE name = 'Wheel Weight'), 2),
(3, (SELECT part_id FROM parts WHERE name = 'Valve Stem'), 4);

-- Battery Replacement (ID 4)
INSERT INTO service_requirements (service_type_id, part_id, quantity) VALUES
(4, (SELECT part_id FROM parts WHERE name = 'Car Battery'), 1),
(4, (SELECT part_id FROM parts WHERE name = 'Battery Terminal'), 6),
(4, (SELECT part_id FROM parts WHERE name = 'Terminal Grease'), 1);

-- Engine Tune-Up (ID 5)
INSERT INTO service_requirements (service_type_id, part_id, quantity) VALUES
(5, (SELECT part_id FROM parts WHERE name = 'Spark Plug'), 2),
(5, (SELECT part_id FROM parts WHERE name = 'Air Filter'), 1),
(5, (SELECT part_id FROM parts WHERE name = 'Fuel Filter'), 1);
