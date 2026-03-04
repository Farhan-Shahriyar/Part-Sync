# PartSync

PartSync is a full-stack Vehicle Service Center Management System built with Next.js and PostgreSQL. It provides role-based dashboards for administrators, mechanics, and customers, backed by a robust relational database with stored procedures, triggers, and partitioned audit logs.

## About the System

PartSync streamlines the end-to-end workflow of a vehicle service center. Administrators manage inventory, service orders, mechanics, and suppliers from a centralized dashboard. Mechanics receive assigned jobs, update progress, and log parts used. Customers register vehicles, book services, and track their order history. The entire stack is containerized with Docker Compose for single-command deployment.

## Features

### Role-Based Access Control
Three distinct user roles — Admin, Mechanic, and Customer — each with a dedicated portal. Admins have full access to dashboards with KPIs, data entry, inventory management with auto-restock, and supplier oversight. Mechanics manage their personal job queue with progress updates and parts logging. Customers can register vehicles, book services, and view order history. Authentication is handled via JWT sessions using `jose` and `bcryptjs`, enforced at the route level through Next.js middleware.

### Advanced Database Backend
A 15-table normalized PostgreSQL schema covers users, customers, vehicles, mechanics, service orders, jobs, parts, inventory, suppliers, purchase orders, payments, and audit logs. The database includes stored procedures (`sp_create_booking`, `sp_assign_mechanic`, `sp_receive_stock`), utility functions (`fn_check_stock`, `fn_calculate_service_total`, `fn_get_available_mechanics`), and triggers for automatic inventory deduction, auto-restocking, mechanic validation, and audit logging.

### Partitioned Audit Logs
All inventory changes are recorded in a partitioned `audit_logs` table (range-partitioned by month) with full old/new JSONB snapshots, enabling scalable and queryable change tracking.

### Analytical Reporting
Complex SQL queries provide customer service history, mechanic performance reports, monthly revenue analysis with window functions, low-stock alerts, and revenue rollup by service type.

### Premium Frontend
A dark-themed, automotive-inspired interface with glassmorphism effects, Framer Motion animations, and a responsive landing page with hero section and feature highlights.

## System Architecture

The application follows a monolithic full-stack architecture using Next.js:

- **Client (frontend)** — Server-rendered React pages and components with Tailwind CSS v4. Handles UI, navigation, and form submissions via Server Actions.
- **Server (backend)** — Next.js Server Actions and server-side logic for authentication, data queries, and business operations. Communicates directly with PostgreSQL via the `pg` driver.
- **Database** — PostgreSQL 15 with PL/pgSQL stored procedures, functions, and triggers. Schema initialization and seed data are handled automatically via Docker entrypoint scripts.

## Tools and Technologies

### Frontend
- **Framework:** Next.js 16, React 19, TypeScript
- **Styling:** Tailwind CSS v4 (via PostCSS)
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Utilities:** clsx, class-variance-authority, tailwind-merge

### Backend
- **Runtime:** Node.js 20
- **Framework:** Next.js Server Actions
- **Database driver:** pg (node-postgres)
- **Authentication:** jose (JWT), bcryptjs (password hashing)

### Database
- **Engine:** PostgreSQL 15 (Alpine)
- **Language:** PL/pgSQL (stored procedures, functions, triggers)
- **Features:** Table partitioning, JSONB columns, check constraints, cascading foreign keys

### DevOps
- **Containerization:** Docker, Docker Compose

## How to Run the System

### Prerequisites
- Docker and Docker Compose installed

### 1. Running with Docker (Recommended)

Clone the repository and start all services:

```bash
git clone https://github.com/<your-username>/Part-Sync.git
cd Part-Sync
docker-compose up --build
```

This will:
- Start a PostgreSQL 15 container and automatically execute the SQL initialization scripts in order (schema, procedures, seed data, queries).
- Build and launch the Next.js application at `http://localhost:3000`.

A default admin account is created by the seed data. Refer to `03_seed_data.sql` for the credentials. Use the registration page to create additional users with properly hashed passwords.

### 2. Running Without Docker

Set up a PostgreSQL instance and execute the SQL scripts in order:

```
01_schema_creation.sql -> 02_procedures_functions.sql -> 03_seed_data.sql -> 04_complex_queries.sql
```

Set the following environment variables (or update `src/lib/db.ts`):

```
DB_USER=<your_db_user>
DB_PASSWORD=<your_db_password>
DB_HOST=localhost
DB_PORT=5432
DB_NAME=vehicle_service_db
```

Install dependencies and start the development server:

```bash
cd vehicle-service-app
npm install
npm run dev
```

## License

This project was developed for academic and educational purposes.
