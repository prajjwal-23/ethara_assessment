# HRMS Lite

A lightweight, production-ready Human Resource Management System for managing employees and tracking daily attendance.

![Tech Stack](https://img.shields.io/badge/FastAPI-009688?style=flat&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white)

---

## Features

- **Employee Management** – Add, view, and delete employee records
- **Attendance Tracking** – Mark daily attendance (Present/Absent) and view records
- **Dashboard** – Summary stats (total employees, today's attendance, present/absent counts)
- **Search & Filter** – Search employees, filter attendance by employee
- **Validation** – Duplicate prevention, email format validation, required fields
- **Responsive UI** – Works on desktop and mobile with sidebar/hamburger navigation
- **Structured Error Responses** – Consistent `{ success, message }` API error format

---

## Tech Stack

| Layer      | Technology                                     |
| ---------- | ---------------------------------------------- |
| **Backend**  | Python 3.11+, FastAPI, SQLAlchemy, Pydantic, Alembic |
| **Frontend** | React 19, TypeScript, Vite, TailwindCSS, Axios |
| **Database** | PostgreSQL (production) / SQLite (development) |
| **Icons**    | Lucide React                                   |

---

## Project Structure

```
ethara_assessment/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI entry point
│   │   ├── core/
│   │   │   ├── config.py        # Environment settings
│   │   │   └── database.py      # SQLAlchemy setup
│   │   ├── models/              # SQLAlchemy ORM models
│   │   ├── schemas/             # Pydantic request/response schemas
│   │   ├── crud/                # Database operations
│   │   ├── api/routes/          # API route handlers
│   │   └── utils/
│   ├── alembic/                 # Database migrations
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   ├── pages/               # Page components
│   │   ├── services/            # API service layer
│   │   ├── types/               # TypeScript interfaces
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── .env.example
└── README.md
```

---

## API Endpoints

### Employees

| Method | Endpoint               | Description           |
| ------ | ---------------------- | --------------------- |
| POST   | `/api/employees`       | Add a new employee    |
| GET    | `/api/employees`       | Get all employees     |
| DELETE | `/api/employees/{id}`  | Delete an employee    |

### Attendance

| Method | Endpoint                            | Description                      |
| ------ | ----------------------------------- | -------------------------------- |
| POST   | `/api/attendance`                   | Mark attendance                  |
| GET    | `/api/attendance`                   | Get all attendance records       |
| GET    | `/api/attendance/{employee_id}`     | Get attendance for an employee   |

---

## Setup & Run Locally

### Prerequisites

- Python 3.11+
- Node.js 18+
- npm or yarn

### 1. Clone the repository

```bash
git clone <repository-url>
cd ethara_assessment
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate
# Activate (Mac/Linux)
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Copy env file
copy .env.example .env
# (or: cp .env.example .env)

# Run the server
uvicorn app.main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`.  
Swagger docs at `http://localhost:8000/docs`.

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Run dev server
npm run dev
```

The frontend will be available at `http://localhost:5173`.  
The Vite dev server proxies `/api` requests to the backend at port 8000.

---

## Deployment

### Backend – Render / Railway

1. Create a new web service pointing to the `backend/` directory.
2. Set environment variables:
   ```
   DATABASE_URL=postgresql://user:password@host:5432/hrms_lite
   CORS_ORIGINS=https://your-frontend-domain.vercel.app
   ```
3. Build command: `pip install -r requirements.txt`
4. Start command: `gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:$PORT`

### Frontend – Vercel / Netlify

1. Create a new project pointing to the `frontend/` directory.
2. Set environment variable:
   ```
   VITE_API_URL=https://your-backend-domain.onrender.com
   ```
3. Build command: `npm run build`
4. Output directory: `dist`

---

## Assumptions & Limitations

- **Single admin user** – No authentication is implemented (as per assignment scope)
- **SQLite for local development** – Automatically creates `hrms_lite.db` on first run
- Leave management, payroll, and other advanced HR features are out of scope

---

## Error Handling

All error responses follow this structure:

```json
{
  "success": false,
  "message": "Error description"
}
```

Handled scenarios:
- Duplicate employee ID or email → `409 Conflict`
- Invalid email format → `422 Unprocessable Entity`
- Missing required fields → `422 Unprocessable Entity`
- Employee not found → `404 Not Found`
- Duplicate attendance entry → `409 Conflict`

---

## License

This project was built as part of a coding assessment.
