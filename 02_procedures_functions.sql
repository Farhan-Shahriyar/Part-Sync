-- =============================================
-- Vehicle Service Center Management System
-- Stored Procedures, Functions, and Triggers
-- =============================================

-- ---------------------------------------------
-- 1. FUNCTIONS
-- ---------------------------------------------

-- Function 1: Check Stock Level
-- Simple utility to check availability of a part
CREATE OR REPLACE FUNCTION fn_check_stock(p_part_id INT)
RETURNS INT
LANGUAGE plpgsql
AS $$
DECLARE
    v_qty INT;
BEGIN
    SELECT quantity_on_hand INTO v_qty
    FROM inventory
    WHERE part_id = p_part_id;
    
    RETURN COALESCE(v_qty, 0);
END;
$$;

-- Function 2: Calculate Service Total Cost
-- Calculates total cost (Parts + Labor) for a service order
CREATE OR REPLACE FUNCTION fn_calculate_service_total(p_order_id INT)
RETURNS DECIMAL(10, 2)
LANGUAGE plpgsql
AS $$
DECLARE
    v_labor_total DECIMAL(10, 2);
    v_parts_total DECIMAL(10, 2);
BEGIN
    -- Calculate total labor cost from jobs
    SELECT COALESCE(SUM(labor_cost), 0) INTO v_labor_total
    FROM service_jobs
    WHERE order_id = p_order_id;
    
    -- Calculate total parts cost from parts_used linked to jobs of this order
    SELECT COALESCE(SUM(pu.quantity * pu.unit_price_at_time), 0) INTO v_parts_total
    FROM parts_used pu
    JOIN service_jobs sj ON pu.job_id = sj.job_id
    WHERE sj.order_id = p_order_id;
    
    RETURN v_labor_total + v_parts_total;
END;
$$;

-- Function 3: Get Available Mechanics
-- Returns a table of mechanics who don't have an active job at the specific time (Simplified logic)
CREATE OR REPLACE FUNCTION fn_get_available_mechanics()
RETURNS TABLE (mechanic_id INT, full_name TEXT, specialty VARCHAR)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT m.mechanic_id, (m.first_name || ' ' || m.last_name)::TEXT, m.specialty
    FROM mechanics m
    WHERE m.is_active = TRUE
    AND m.mechanic_id NOT IN (
        SELECT sj.mechanic_id 
        FROM service_jobs sj 
        WHERE sj.status IN ('IN_PROGRESS') AND sj.mechanic_id IS NOT NULL
    );
END;
$$;

-- ---------------------------------------------
-- 2. STORED PROCEDURES
-- ---------------------------------------------

-- Procedure 1: Create Service Booking
-- Creates an order and the initial job
CREATE OR REPLACE PROCEDURE sp_create_booking(
    p_customer_id INT,
    p_vehicle_id INT,
    p_service_type_id INT,
    p_expected_date TIMESTAMPTZ,
    INOUT p_new_order_id INT DEFAULT NULL
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Insert Header
    INSERT INTO service_orders (customer_id, vehicle_id, expected_completion, status)
    VALUES (p_customer_id, p_vehicle_id, p_expected_date, 'PENDING')
    RETURNING order_id INTO p_new_order_id;
    
    -- Create Initial Job
    INSERT INTO service_jobs (order_id, service_type_id, status)
    VALUES (p_new_order_id, p_service_type_id, 'PENDING');
    
    COMMIT;
END;
$$;

-- Procedure 2: Assign Mechanic to Job
-- Updates job status and mechanic
CREATE OR REPLACE PROCEDURE sp_assign_mechanic(
    p_job_id INT,
    p_mechanic_id INT
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_hourly_rate DECIMAL(10, 2);
    v_estimated_hours DECIMAL(4, 2);
BEGIN
    -- Get mechanic rate
    SELECT hourly_rate INTO v_hourly_rate FROM mechanics WHERE mechanic_id = p_mechanic_id;
    
    -- Get estimated hours for the service type
    SELECT st.estimated_hours INTO v_estimated_hours
    FROM service_types st
    JOIN service_jobs sj ON st.service_type_id = sj.service_type_id
    WHERE sj.job_id = p_job_id;
    
    -- Update Job
    UPDATE service_jobs
    SET mechanic_id = p_mechanic_id,
        status = 'ASSIGNED',
        labor_cost = v_hourly_rate * v_estimated_hours
    WHERE job_id = p_job_id;
    
    COMMIT;
END;
$$;

-- Procedure 3: Receive Stock (Process Purchase Order)
-- Updates inventory and PO status
CREATE OR REPLACE PROCEDURE sp_receive_stock(
    p_po_id INT
)
LANGUAGE plpgsql
AS $$
DECLARE
    r RECORD;
BEGIN
    -- Loop through PO items
    FOR r IN SELECT part_id, quantity FROM po_items WHERE po_id = p_po_id
    LOOP
        -- Update Inventory
        UPDATE inventory
        SET quantity_on_hand = quantity_on_hand + r.quantity,
            last_restocked_at = CURRENT_TIMESTAMP
        WHERE part_id = r.part_id;
    END LOOP;
    
    -- Update PO Status
    UPDATE purchase_orders
    SET status = 'RECEIVED'
    WHERE po_id = p_po_id;
    
    COMMIT;
END;
$$;

-- ---------------------------------------------
-- 3. TRIGGERS
-- ---------------------------------------------

-- Trigger 1: Automatically Deduct Inventory
CREATE OR REPLACE FUNCTION trg_fn_deduct_inventory()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    -- Check if enough stock exists
    IF (SELECT quantity_on_hand FROM inventory WHERE part_id = NEW.part_id) < NEW.quantity THEN
        RAISE EXCEPTION 'Insufficient stock for part_id %', NEW.part_id;
    END IF;

    -- Update inventory
    UPDATE inventory
    SET quantity_on_hand = quantity_on_hand - NEW.quantity
    WHERE part_id = NEW.part_id;
    
    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_deduct_inventory
AFTER INSERT ON parts_used
FOR EACH ROW
EXECUTE FUNCTION trg_fn_deduct_inventory();

-- Trigger 2: Audit Logs
-- A generic function to log changes
CREATE OR REPLACE FUNCTION trg_fn_audit_log()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
    v_old_data JSONB;
    v_new_data JSONB;
BEGIN
    IF (TG_OP = 'UPDATE') THEN
        v_old_data = to_jsonb(OLD);
        v_new_data = to_jsonb(NEW);
    ELSIF (TG_OP = 'DELETE') THEN
        v_old_data = to_jsonb(OLD);
        v_new_data = NULL;
    ELSIF (TG_OP = 'INSERT') THEN
        v_old_data = NULL;
        v_new_data = to_jsonb(NEW);
    END IF;

    INSERT INTO audit_logs (table_name, record_id, action, old_data, new_data)
    VALUES (TG_TABLE_NAME, 
            CASE 
                WHEN TG_OP = 'DELETE' THEN OLD.inventory_id::TEXT -- Example for inventory, needs generic handling or per-table setup in real world. 
                ELSE NEW.inventory_id::TEXT -- Assuming inventory for this specific example trigger or using dynamic SQL for strictly generic which is complex.
                -- For simplicity/safety in this demo, let's assume we attach this to tables with evident IDs or cast the whole record.
                -- We will just cast the first column value if possible, or use a generic ID.
                -- Better approach for this demo:
                COALESCE(NEW.inventory_id, OLD.inventory_id)::TEXT
            END,
            TG_OP, v_old_data, v_new_data);
            
    RETURN NEW;
END;
$$;

-- Note: The generic ID handling above is tricky in strict SQL without dynamic execution. 
-- For this academic project, I will refine the audit trigger to be specific to 'Inventory' updates as "Sensitive updates" was the requirement.

CREATE OR REPLACE FUNCTION trg_fn_audit_inventory()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO audit_logs (table_name, record_id, action, old_data, new_data)
    VALUES ('inventory', 
            COALESCE(NEW.inventory_id, OLD.inventory_id)::TEXT,
            TG_OP, 
            to_jsonb(OLD), 
            to_jsonb(NEW));
    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_audit_inventory_changes
AFTER UPDATE OR DELETE ON inventory
FOR EACH ROW
EXECUTE FUNCTION trg_fn_audit_inventory();

-- Trigger 3: Validate Mechanic Availability Not Implemented as overlapping check logic is complex for strict trigger, 
-- but we have the function fn_get_available_mechanics. 
-- Let's implement a simple check trigger for valid assignment.

CREATE OR REPLACE FUNCTION trg_fn_validate_mechanic_assignment()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    -- If mechanic is being assigned (not null)
    IF NEW.mechanic_id IS NOT NULL THEN
        -- Check if mechanic exists and is active (FK covers existence, this checks logic)
        IF NOT EXISTS (SELECT 1 FROM mechanics WHERE mechanic_id = NEW.mechanic_id AND is_active = TRUE) THEN
            RAISE EXCEPTION 'Mechanic % is not active', NEW.mechanic_id;
        END IF;
    END IF;
    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_validate_mechanic
BEFORE INSERT OR UPDATE ON service_jobs
FOR EACH ROW
EXECUTE FUNCTION trg_fn_validate_mechanic_assignment();
