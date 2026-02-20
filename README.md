# HRMS Lite

A lightweight Human Resource Management System for managing employees and tracking daily attendance. Built as a full-stack application with a FastAPI backend and a React frontend.

---

## Project Overview

HRMS Lite provides core HR operations through a clean, responsive web interface:

- **Employee Management** — Add new employees, view the employee directory, and remove employees
- **Attendance Tracking** — Mark daily attendance as Present or Absent, view attendance records filtered by employee
- **Dashboard** — At-a-glance stats including total employees, today's present/absent counts, and recent additions
- **Validation & Error Handling** — Prevents duplicate employee IDs/emails, validates input formats, and returns structured error responses

### API Endpoints

| Method | Endpoint                        | Description                    |
|--------|---------------------------------|--------------------------------|
| POST   | `/api/employees`                | Add a new employee             |
| GET    | `/api/employees`                | List all employees             |
| DELETE | `/api/employees/{employee_id}`  | Delete an employee             |
| POST   | `/api/attendance`               | Mark attendance                |
| GET    | `/api/attendance`               | List all attendance records    |
| GET    | `/api/attendance/{employee_id}` | Get attendance for an employee |

---

## Tech Stack

| Layer        | Technology                                            |
|--------------|-------------------------------------------------------|
| **Backend**  | Python 3.12, FastAPI, SQLAlchemy ORM, Pydantic, Alembic |
| **Frontend** | React 19, TypeScript, Vite, TailwindCSS, Axios        |
| **Database** | PostgreSQL (production via Render) / SQLite (local dev) |
| **Icons**    | Lucide React                                          |
| **Deployment** | Render (Backend + PostgreSQL), Vercel (Frontend)    |

---

## Steps to Run Locally

### Prerequisites

- Python 3.11+
- Node.js 18+
- npm

### 1. Clone the repository

```bash
git clone https://github.com/prajjwal-23/ethara_assessment.git
cd ethara_assessment
```

### 2. Backend

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Mac/Linux

# Install dependencies
pip install -r requirements.txt

# Create .env from example and configure DATABASE_URL
copy .env.example .env

# Start the server
uvicorn app.main:app --reload --port 8000
```

- API available at: `http://localhost:8000`
- Swagger docs at: `http://localhost:8000/docs`

> If no `DATABASE_URL` is set in `.env`, the app falls back to a local SQLite database (`hrms_lite.db`).

### 3. Frontend

Open a **second terminal**:

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

- App available at: `http://localhost:5173`
- The Vite dev server automatically proxies `/api` requests to the backend at port 8000

---

## Project Structure

```
ethara_assessment/
├── backend/
│   ├── app/
│   │   ├── main.py            # FastAPI application entry point
│   │   ├── core/
│   │   │   ├── config.py      # Environment config (Pydantic Settings)
│   │   │   └── database.py    # SQLAlchemy engine & session setup
│   │   ├── models/            # SQLAlchemy ORM models (Employee, Attendance)
│   │   ├── schemas/           # Pydantic request/response schemas
│   │   ├── crud/              # Database CRUD operations
│   │   └── api/routes/        # API route handlers
│   ├── alembic/               # Database migration config
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/        # 8 reusable UI components
│   │   ├── pages/             # 4 page components
│   │   ├── services/api.ts    # Axios API service layer
│   │   ├── types/index.ts     # TypeScript interfaces
│   │   └── App.tsx            # Root component with routing
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

---

## Assumptions & Limitations

- **No Authentication** — The app does not include login/signup or role-based access control; it assumes a single admin user
- **Scope** — Only employee management and attendance tracking are implemented; leave management, payroll, reports, and other advanced HR features are out of scope
- **Attendance Status** — Limited to two values: `Present` and `Absent`
- **Duplicate Prevention** — Employee ID and email must be unique; only one attendance record per employee per date is allowed
- **Free Tier Hosting** — If deployed on Render's free plan, the backend may experience cold start delays (~30–60 seconds) after periods of inactivity
- **Database** — Uses SQLite for local development (auto-created on first run) and PostgreSQL for production deployment
