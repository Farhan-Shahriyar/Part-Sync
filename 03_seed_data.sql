-- =============================================
-- Vehicle Service Center Management System
-- Seed Data Script
-- =============================================

-- 1. Users
INSERT INTO users (username, password_hash, role) VALUES
('admin', 'hash_admin_123', 'ADMIN'),
('manager_bob', 'hash_bob_456', 'MANAGER'),
('mechanic_mike', 'hash_mike_789', 'MECHANIC'),
('mechanic_sarah', 'hash_sarah_000', 'MECHANIC'),
('receptionist_alice', 'hash_alice_111', 'RECEPTIONIST');

-- 2. Mechanics
INSERT INTO mechanics (user_id, first_name, last_name, specialty, hourly_rate) VALUES
(3, 'Mike', 'Davidson', 'Engine Repair', 45.00),
(4, 'Sarah', 'Connor', 'Diagnostics & Electronics', 55.00),
(NULL, 'Tom', 'Wrench', 'General Maintenance', 40.00);

-- 3. Customers
INSERT INTO customers (first_name, last_name, email, phone, address) VALUES
('John', 'Doe', 'john.doe@example.com', '555-0101', '123 Maple St'),
('Jane', 'Smith', 'jane.smith@example.com', '555-0102', '456 Oak Ave'),
('Robert', 'Brown', 'robert.b@example.com', '555-0103', '789 Pine Ln');

-- 4. Vehicles
INSERT INTO vehicles (customer_id, vin, make, model, year, license_plate, color) VALUES
(1, '1HGCM82633A004352', 'Honda', 'Accord', 2018, 'ABC-1234', 'Silver'),
(1, '1FDXE45233A009988', 'Ford', 'F-150', 2020, 'TRK-9988', 'Blue'),
(2, 'JT23242333A001122', 'Toyota', 'Camry', 2019, 'XYZ-5678', 'White'),
(3, 'WBA3424233A005544', 'BMW', 'X5', 2021, 'LUX-3344', 'Black');

-- 5. Service Types
INSERT INTO service_types (name, description, estimated_hours, base_labor_cost) VALUES
('Oil Change', 'Standard oil and filter change', 0.5, 30.00),
('Brake Pad Replacement', 'Front or rear brake pads', 1.5, 90.00),
('General Inspection', 'Multi-point safety inspection', 1.0, 60.00),
('Engine Tune-up', 'Spark plugs, air filter, system check', 2.0, 120.00);

-- 6. Suppliers
INSERT INTO suppliers (name, contact_person, phone, email) VALUES
('AutoParts Warehouse', 'Jim Halpert', '555-9000', 'orders@autopartswarehouse.com'),
('Global Tyres Inc', 'Pam Beesly', '555-9001', 'sales@globaltyres.com'),
('Oem Spares Co', 'Dwight Schrute', '555-9002', 'dwight@oemspares.com');

-- 7. Parts
INSERT INTO parts (part_number, name, description, manufacturer, unit_price) VALUES
('OIL-5W30', '5W-30 Synthetic Oil (1L)', 'High performance synthetic oil', 'Castrol', 12.50),
('FLT-OIL-001', 'Oil Filter Standard', 'Standard oil filter', 'Bosch', 8.00),
('BRK-PAD-001', 'Ceramic Brake Pads', 'Front set ceramic pads', 'Brembo', 45.00),
('SPK-PLG-NGK', 'NGK Iridium Spark Plug', 'Long life spark plug', 'NGK', 15.00),
('AIR-FLT-009', 'Air Filter', 'High flow air filter', 'K&N', 25.00);

-- 8. Inventory (Initial Stock)
INSERT INTO inventory (part_id, quantity_on_hand, reorder_level) VALUES
(1, 100, 20), -- Oil
(2, 50, 10), -- Oil Filter
(3, 20, 5),  -- Brake Pads
(4, 60, 24), -- Spark Plugs
(5, 30, 5);  -- Air Filter

-- 9. Purchase Orders (Restocking History)
INSERT INTO purchase_orders (supplier_id, order_date, status, total_amount) VALUES
(1, NOW() - INTERVAL '1 month', 'RECEIVED', 500.00),
(3, NOW() - INTERVAL '2 weeks', 'RECEIVED', 300.00);

-- 10. Service Orders & Jobs (History)
-- Order 1: Completed Oil Change for John Doe
INSERT INTO service_orders (customer_id, vehicle_id, order_date, expected_completion, status, total_amount) 
VALUES (1, 1, NOW() - INTERVAL '5 days', NOW() - INTERVAL '4 days', 'COMPLETED', 70.50);

INSERT INTO service_jobs (order_id, service_type_id, mechanic_id, status, actual_labor_hours, labor_cost)
VALUES ((SELECT MAX(order_id) FROM service_orders), 1, 1, 'COMPLETED', 0.5, 30.00);

-- Usage for Order 1
INSERT INTO parts_used (job_id, part_id, quantity, unit_price_at_time) VALUES
((SELECT MAX(job_id) FROM service_jobs), 1, 4, 12.50), -- 4L Oil
((SELECT MAX(job_id) FROM service_jobs), 2, 1, 10.50); -- 1 Filter

-- Order 2: In Repair for Jane Smith (Brakes)
INSERT INTO service_orders (customer_id, vehicle_id, order_date, expected_completion, status)
VALUES (2, 3, NOW() - INTERVAL '1 day', NOW() + INTERVAL '1 day', 'IN_PROGRESS');

INSERT INTO service_jobs (order_id, service_type_id, mechanic_id, status, notes)
VALUES ((SELECT MAX(order_id) FROM service_orders), 2, 2, 'IN_PROGRESS', '{"observation": "Rotors look slightly worn but okay for now"}');

-- Order 3: Pending Tune-up for Robert Brown
INSERT INTO service_orders (customer_id, vehicle_id, order_date, expected_completion, status)
VALUES (3, 4, NOW(), NOW() + INTERVAL '2 days', 'PENDING');

INSERT INTO service_jobs (order_id, service_type_id, status)
VALUES ((SELECT MAX(order_id) FROM service_orders), 4, 'PENDING');
