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

export async function getMechanicJobsByUserId(userId: number) {
  const res = await query(`
      SELECT sj.*, so.order_date, c.first_name || ' ' || c.last_name as customer_name, st.name as service_name, v.make, v.model, v.license_plate 
      FROM service_jobs sj
      JOIN mechanics m ON sj.mechanic_id = m.mechanic_id
      JOIN service_orders so ON sj.order_id = so.order_id
      JOIN vehicles v ON so.vehicle_id = v.vehicle_id
      JOIN customers c ON so.customer_id = c.customer_id
      JOIN service_types st ON sj.service_type_id = st.service_type_id
      WHERE m.user_id = $1 AND sj.status IN ('ASSIGNED', 'IN_PROGRESS')
      ORDER BY sj.status ASC, so.order_date ASC
    `, [userId]);
  return res.rows;
}

export async function getCustomerStats(userId: number) {
  // Get customer details
  const customerRes = await query('SELECT * FROM customers WHERE user_id = $1', [userId]);
  const customer = customerRes.rows[0];

  if (!customer) return null;

  // Get vehicles
  const vehiclesRes = await query('SELECT * FROM vehicles WHERE customer_id = $1', [customer.customer_id]);

  // Get active bookings
  const bookingsRes = await query(`
        SELECT so.*, v.make, v.model, v.license_plate
        FROM service_orders so
        JOIN vehicles v ON so.vehicle_id = v.vehicle_id
        WHERE so.customer_id = $1 AND so.status IN ('PENDING', 'IN_PROGRESS')
        ORDER BY so.order_date DESC
    `, [customer.customer_id]);

  // Get history
  const historyRes = await query(`
        SELECT so.*, v.make, v.model, st.name as service_name
        FROM service_orders so
        JOIN vehicles v ON so.vehicle_id = v.vehicle_id
        LEFT JOIN service_jobs sj ON so.order_id = sj.order_id
        LEFT JOIN service_types st ON sj.service_type_id = st.service_type_id
        WHERE so.customer_id = $1 AND so.status IN ('COMPLETED', 'PAID')
        ORDER BY so.order_date DESC
        LIMIT 5
    `, [customer.customer_id]);

  return {
    customer,
    vehicles: vehiclesRes.rows,
    bookings: bookingsRes.rows,
    history: historyRes.rows
  };
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

  // Pending Jobs
  const pendingJobsRes = await query(`
        SELECT COUNT(*) as count 
        FROM service_jobs 
        WHERE status = 'PENDING' AND mechanic_id IS NULL
    `);

  return {
    revenueCtx: revenueRes.rows,
    lowStock: lowStockRes.rows,
    topMechanics: mechanicRes.rows,
    pendingJobs: parseInt(pendingJobsRes.rows[0].count)
  };
}
