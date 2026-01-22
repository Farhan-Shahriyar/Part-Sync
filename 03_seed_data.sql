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
    service_types, 
    suppliers, 
    parts,
    service_requirements,
    audit_logs
RESTART IDENTITY CASCADE;

-- 1. Users
INSERT INTO users (username, password_hash, role) VALUES
('admin', 'hash_admin_123', 'ADMIN'),
('manager_bob', 'hash_bob_456', 'MANAGER'),
('mechanic_mike', 'hash_mike_789', 'MECHANIC'),
('mechanic_sarah', 'hash_sarah_000', 'MECHANIC'),
('receptionist_alice', 'hash_alice_111', 'RECEPTIONIST'),
('customer_john', 'hash_john_123', 'CUSTOMER'),
('customer_jane', 'hash_jane_456', 'CUSTOMER'),
('customer_robert', 'hash_robert_789', 'CUSTOMER')
ON CONFLICT (username) DO NOTHING;

-- 2. Mechanics
INSERT INTO mechanics (user_id, first_name, last_name, specialty, hourly_rate) VALUES
((SELECT user_id FROM users WHERE username = 'mechanic_mike'), 'Mike', 'Davidson', 'Engine Repair', 45.00),
((SELECT user_id FROM users WHERE username = 'mechanic_sarah'), 'Sarah', 'Connor', 'Diagnostics & Electronics', 55.00),
(NULL, 'Tom', 'Wrench', 'General Maintenance', 40.00);

-- 3. Customers
INSERT INTO customers (user_id, first_name, last_name, email, phone, address) VALUES
((SELECT user_id FROM users WHERE username = 'customer_john'), 'John', 'Doe', 'john.doe@example.com', '555-0101', '123 Maple St'),
((SELECT user_id FROM users WHERE username = 'customer_jane'), 'Jane', 'Smith', 'jane.smith@example.com', '555-0102', '456 Oak Ave'),
((SELECT user_id FROM users WHERE username = 'customer_robert'), 'Robert', 'Brown', 'robert.b@example.com', '555-0103', '789 Pine Ln')
ON CONFLICT (email) DO NOTHING;

-- 4. Vehicles
INSERT INTO vehicles (customer_id, vin, make, model, year, license_plate, color) VALUES
((SELECT customer_id FROM customers WHERE email = 'john.doe@example.com'), '1HGCM82633A004352', 'Honda', 'Accord', 2018, 'ABC-1234', 'Silver'),
((SELECT customer_id FROM customers WHERE email = 'john.doe@example.com'), '1FDXE45233A009988', 'Ford', 'F-150', 2020, 'TRK-9988', 'Blue'),
((SELECT customer_id FROM customers WHERE email = 'jane.smith@example.com'), 'JT23242333A001122', 'Toyota', 'Camry', 2019, 'XYZ-5678', 'White'),
((SELECT customer_id FROM customers WHERE email = 'robert.b@example.com'), 'WBA3424233A005544', 'BMW', 'X5', 2021, 'LUX-3344', 'Black')
ON CONFLICT (vin) DO NOTHING;

-- 5. Service Types
INSERT INTO service_types (name, description, estimated_hours, base_labor_cost) VALUES
('Oil Change', 'Standard oil and filter change', 0.5, 30.00),
('Brake Pad Replacement', 'Front or rear brake pads', 1.5, 90.00),
('General Inspection', 'Multi-point safety inspection', 1.0, 60.00),
('Engine Tune-up', 'Spark plugs, air filter, system check', 2.0, 120.00)
ON CONFLICT (name) DO NOTHING;

-- 6. Suppliers
INSERT INTO suppliers (name, contact_person, phone, email) VALUES
('AutoParts Warehouse', 'Jim Halpert', '555-9000', 'orders@autopartswarehouse.com'),
('Global Tyres Inc', 'Pam Beesly', '555-9001', 'sales@globaltyres.com'),
('Oem Spares Co', 'Dwight Schrute', '555-9002', 'dwight@oemspares.com')
ON CONFLICT (name) DO NOTHING;

-- 7. Parts
INSERT INTO parts (part_number, name, description, manufacturer, unit_price) VALUES
('OIL-5W30', '5W-30 Synthetic Oil (1L)', 'High performance synthetic oil', 'Castrol', 12.50),
('FLT-OIL-001', 'Oil Filter Standard', 'Standard oil filter', 'Bosch', 8.00),
('BRK-PAD-001', 'Ceramic Brake Pads', 'Front set ceramic pads', 'Brembo', 45.00),
('SPK-PLG-NGK', 'NGK Iridium Spark Plug', 'Long life spark plug', 'NGK', 15.00),
('AIR-FLT-009', 'Air Filter', 'High flow air filter', 'K&N', 25.00)
ON CONFLICT (part_number) DO NOTHING;

-- 8. Inventory (Initial Stock)
INSERT INTO inventory (part_id, quantity_on_hand, reorder_level) VALUES
((SELECT part_id FROM parts WHERE part_number = 'OIL-5W30'), 100, 20),
((SELECT part_id FROM parts WHERE part_number = 'FLT-OIL-001'), 50, 10),
((SELECT part_id FROM parts WHERE part_number = 'BRK-PAD-001'), 20, 5),
((SELECT part_id FROM parts WHERE part_number = 'SPK-PLG-NGK'), 60, 24),
    ((SELECT part_id FROM parts WHERE part_number = 'AIR-FLT-009'), 30, 5)
ON CONFLICT (part_id) DO NOTHING;

-- 8b. Service Requirements (Seed)
INSERT INTO service_requirements (service_type_id, part_id, quantity) VALUES
-- Oil Change needs Oil and Filter
((SELECT service_type_id FROM service_types WHERE name = 'Oil Change'), (SELECT part_id FROM parts WHERE part_number = 'OIL-5W30'), 4),
((SELECT service_type_id FROM service_types WHERE name = 'Oil Change'), (SELECT part_id FROM parts WHERE part_number = 'FLT-OIL-001'), 1),
-- Brake Pad Replacement needs Brake Pads
((SELECT service_type_id FROM service_types WHERE name = 'Brake Pad Replacement'), (SELECT part_id FROM parts WHERE part_number = 'BRK-PAD-001'), 1),
-- Tune-up needs Spark Plugs and Air Filter
((SELECT service_type_id FROM service_types WHERE name = 'Engine Tune-up'), (SELECT part_id FROM parts WHERE part_number = 'SPK-PLG-NGK'), 4),
((SELECT service_type_id FROM service_types WHERE name = 'Engine Tune-up'), (SELECT part_id FROM parts WHERE part_number = 'AIR-FLT-009'), 1);

-- 9. Purchase Orders (Restocking History)
INSERT INTO purchase_orders (supplier_id, order_date, status, total_amount) VALUES
((SELECT supplier_id FROM suppliers WHERE name = 'AutoParts Warehouse'), NOW() - INTERVAL '1 month', 'RECEIVED', 500.00),
((SELECT supplier_id FROM suppliers WHERE name = 'Oem Spares Co'), NOW() - INTERVAL '2 weeks', 'RECEIVED', 300.00);

-- 10. Service Orders & Jobs (History)
-- Order 1: Completed Oil Change for John Doe
INSERT INTO service_orders (customer_id, vehicle_id, order_date, expected_completion, status, total_amount) 
VALUES (
    (SELECT customer_id FROM customers WHERE email = 'john.doe@example.com'), 
    (SELECT vehicle_id FROM vehicles WHERE vin = '1HGCM82633A004352'), 
    NOW() - INTERVAL '5 days', 
    NOW() - INTERVAL '4 days', 
    'COMPLETED', 
    70.50
);

INSERT INTO service_jobs (order_id, service_type_id, mechanic_id, status, actual_labor_hours, labor_cost)
VALUES (
    (SELECT order_id FROM service_orders WHERE customer_id = (SELECT customer_id FROM customers WHERE email = 'john.doe@example.com') ORDER BY order_id DESC LIMIT 1), 
    (SELECT service_type_id FROM service_types WHERE name = 'Oil Change'), 
    (SELECT mechanic_id FROM mechanics WHERE first_name = 'Mike'), 
    'COMPLETED', 
    0.5, 
    30.00
);

-- Usage for Order 1
INSERT INTO parts_used (job_id, part_id, quantity, unit_price_at_time) VALUES
(
    (SELECT job_id FROM service_jobs WHERE status = 'COMPLETED' ORDER BY job_id DESC LIMIT 1), 
    (SELECT part_id FROM parts WHERE part_number = 'OIL-5W30'), 
    4, 
    12.50
), 
(
    (SELECT job_id FROM service_jobs WHERE status = 'COMPLETED' ORDER BY job_id DESC LIMIT 1), 
    (SELECT part_id FROM parts WHERE part_number = 'FLT-OIL-001'), 
    1, 
    10.50
);

-- Order 2: In Repair for Jane Smith (Brakes)
INSERT INTO service_orders (customer_id, vehicle_id, order_date, expected_completion, status)
VALUES (
    (SELECT customer_id FROM customers WHERE email = 'jane.smith@example.com'), 
    (SELECT vehicle_id FROM vehicles WHERE vin = 'JT23242333A001122'), 
    NOW() - INTERVAL '1 day', 
    NOW() + INTERVAL '1 day', 
    'IN_PROGRESS'
);

INSERT INTO service_jobs (order_id, service_type_id, mechanic_id, status, notes)
VALUES (
    (SELECT order_id FROM service_orders WHERE customer_id = (SELECT customer_id FROM customers WHERE email = 'jane.smith@example.com') ORDER BY order_id DESC LIMIT 1), 
    (SELECT service_type_id FROM service_types WHERE name = 'Brake Pad Replacement'), 
    (SELECT mechanic_id FROM mechanics WHERE first_name = 'Sarah'), 
    'IN_PROGRESS', 
    '{"observation": "Rotors look slightly worn but okay for now"}'
);

-- Order 3: Pending Tune-up for Robert Brown
INSERT INTO service_orders (customer_id, vehicle_id, order_date, expected_completion, status)
VALUES (
    (SELECT customer_id FROM customers WHERE email = 'robert.b@example.com'), 
    (SELECT vehicle_id FROM vehicles WHERE vin = 'WBA3424233A005544'), 
    NOW(), 
    NOW() + INTERVAL '2 days', 
    'PENDING'
);

INSERT INTO service_jobs (order_id, service_type_id, status)
VALUES (
    (SELECT order_id FROM service_orders WHERE customer_id = (SELECT customer_id FROM customers WHERE email = 'robert.b@example.com') ORDER BY order_id DESC LIMIT 1), 
    (SELECT service_type_id FROM service_types WHERE name = 'Engine Tune-up'), 
    'PENDING'
);
