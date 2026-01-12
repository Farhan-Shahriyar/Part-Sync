-- =============================================
-- Vehicle Service Center Management System
-- Complex Reporting & Analytical Queries
-- =============================================

-- 1. Full Service History for a Customer
-- JOINS: Customer -> Vehicle -> Order -> Job -> ServiceType -> Mechanic
SELECT 
    c.first_name || ' ' || c.last_name AS customer_name,
    v.make || ' ' || v.model AS vehicle_info,
    so.order_date,
    st.name AS service_performed,
    m.first_name || ' ' || m.last_name AS mechanic_name,
    sj.labor_cost,
    (SELECT SUM(quantity * unit_price_at_time) FROM parts_used WHERE job_id = sj.job_id) AS parts_cost,
    so.total_amount
FROM customers c
JOIN vehicles v ON c.customer_id = v.customer_id
JOIN service_orders so ON v.vehicle_id = so.vehicle_id
JOIN service_jobs sj ON so.order_id = sj.order_id
JOIN service_types st ON sj.service_type_id = st.service_type_id
LEFT JOIN mechanics m ON sj.mechanic_id = m.mechanic_id
WHERE c.customer_id = 1
ORDER BY so.order_date DESC;

-- 2. Mechanic Performance Report (Efficiency and Revenue)
-- Aggregation with Grouping
SELECT 
    m.first_name || ' ' || m.last_name AS mechanic,
    COUNT(sj.job_id) AS total_jobs_completed,
    AVG(sj.actual_labor_hours) AS avg_hours_per_job,
    SUM(sj.labor_cost) AS total_labor_revenue_generated
FROM mechanics m
JOIN service_jobs sj ON m.mechanic_id = sj.mechanic_id
WHERE sj.status = 'COMPLETED'
GROUP BY m.mechanic_id, m.first_name, m.last_name
ORDER BY total_labor_revenue_generated DESC;

-- 3. Monthly Revenue Report with Rolling Total
-- Window Functions and CTE
WITH MonthlyStats AS (
    SELECT 
        EXTRACT(YEAR FROM order_date) AS yr,
        EXTRACT(MONTH FROM order_date) AS mth,
        COUNT(order_id) AS total_orders,
        SUM(total_amount) AS monthly_revenue
    FROM service_orders
    WHERE status IN ('COMPLETED', 'PAID')
    GROUP BY EXTRACT(YEAR FROM order_date), EXTRACT(MONTH FROM order_date)
)
SELECT 
    yr, 
    TO_CHAR(TO_DATE(mth::text, 'MM'), 'Month') AS month_name,
    total_orders,
    monthly_revenue,
    SUM(monthly_revenue) OVER (ORDER BY yr, mth) AS running_total_revenue
FROM MonthlyStats;

-- 4. Low Stock Alert Report
-- Subquery and Filtering
SELECT 
    p.name AS part_name,
    p.part_number,
    i.quantity_on_hand,
    i.reorder_level,
    (i.reorder_level - i.quantity_on_hand) AS shortage
FROM inventory i
JOIN parts p ON i.part_id = p.part_id
WHERE i.quantity_on_hand <= i.reorder_level;

-- 5. Revenue Analysis by Service Type (Rollup)
-- Advanced Grouping (ROLLUP)
SELECT 
    COALESCE(st.name, 'All Services') AS service_category,
    EXTRACT(YEAR FROM so.order_date) AS year,
    SUM(sj.labor_cost) AS total_labor_revenue,
    COUNT(sj.job_id) AS job_count
FROM service_jobs sj
JOIN service_types st ON sj.service_type_id = st.service_type_id
JOIN service_orders so ON sj.order_id = so.order_id
WHERE so.status = 'COMPLETED'
GROUP BY ROLLUP (st.name, EXTRACT(YEAR FROM so.order_date))
ORDER BY st.name, year;
