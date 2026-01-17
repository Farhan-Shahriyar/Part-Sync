import { query } from './db';

// Dropdown Helpers
export async function getServiceTypes() {
    const res = await query('SELECT * FROM service_types ORDER BY name');
    return res.rows;
}

export async function getCustomers() {
    const res = await query('SELECT * FROM customers ORDER BY last_name');
    return res.rows;
}

export async function getVehicles(customerId: number) {
    const res = await query('SELECT * FROM vehicles WHERE customer_id = $1', [customerId]);
    return res.rows;
}

export async function getMechanicJobs(mechanicId: number) {
    const res = await query(`
      SELECT sj.*, so.order_date, c.first_name || ' ' || c.last_name as customer_name, st.name as service_name, v.make, v.model, v.license_plate 
      FROM service_jobs sj
      JOIN service_orders so ON sj.order_id = so.order_id
      JOIN vehicles v ON so.vehicle_id = v.vehicle_id
      JOIN customers c ON so.customer_id = c.customer_id
      JOIN service_types st ON sj.service_type_id = st.service_type_id
      WHERE sj.mechanic_id = $1 AND sj.status IN ('ASSIGNED', 'IN_PROGRESS')
      ORDER BY sj.status ASC, so.order_date ASC
    `, [mechanicId]);
    return res.rows;
}

// Dashboard Queries
export async function getDashboardStats() {
    // Monthly Revenue Trend
    const revenueRes = await query(`
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
        monthly_revenue::numeric::float as monthly_revenue
    FROM MonthlyStats
    ORDER BY yr DESC, mth DESC
    LIMIT 6;
  `);

    // Low Stock Items
    const lowStockRes = await query(`
    SELECT 
        p.name AS part_name,
        p.part_number,
        i.quantity_on_hand,
        i.reorder_level
    FROM inventory i
    JOIN parts p ON i.part_id = p.part_id
    WHERE i.quantity_on_hand <= i.reorder_level
    LIMIT 5;
  `);

    // Top Mechanics
    const mechanicRes = await query(`
    SELECT 
        m.first_name || ' ' || m.last_name AS mechanic,
        COUNT(sj.job_id) AS total_jobs_completed,
        SUM(sj.labor_cost)::numeric::float AS total_revenue
    FROM mechanics m
    JOIN service_jobs sj ON m.mechanic_id = sj.mechanic_id
    WHERE sj.status = 'COMPLETED'
    GROUP BY m.mechanic_id, m.first_name, m.last_name
    ORDER BY total_revenue DESC
    LIMIT 3;
  `);

    return {
        revenueCtx: revenueRes.rows,
        lowStock: lowStockRes.rows,
        topMechanics: mechanicRes.rows
    };
}
