# 🎓 Student Management System

A full-stack web application for managing student records, built with React, Node.js (Express), and PostgreSQL.

![Status](https://img.shields.io/badge/status-complete-success)
![License](https://img.shields.io/badge/license-MIT-blue)

---

## 📋 Table of Contents

- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [Setup Instructions](#-setup-instructions)
- [Database Schema](#-database-schema)
- [API Endpoints](#-api-endpoints)
- [Environment Variables](#-environment-variables)
- [Screenshots](#-screenshots)

---

## ✨ Features

### Core Features
- ✅ **Add Student** — Capture name, course, year, DOB, email, mobile, gender, address, and photo
- ✅ **Edit / Update Student** — Modify any existing student record
- ✅ **View Student List** — Paginated, searchable, filterable table view
- ✅ **Delete Student** — Remove student records with confirmation
- ✅ **Photo Upload** — Upload and store student photos (JPEG/PNG/WebP, max 5MB)
- ✅ **Auto-generated Admission Number** — Unique, sequential (e.g. `ADM20260001`)
- ✅ **Frontend + Backend Validation** — Robust validation on both client and server
- ✅ **Responsive UI** — Works on desktop, tablet, and mobile

### Bonus Features
- ⭐ **Search** — Search by name, email, admission number, course, or mobile number
- ⭐ **Filters** — Filter by course, year, and gender
- ⭐ **Server-side Pagination** — Efficient pagination for large datasets
- ⭐ **Analytics Dashboard** — Charts for enrollment trends, course/gender/year distribution
- ⭐ **Activity Logging** — Tracks every create/update/delete action with timestamps
- ⭐ **Database Indexes** — Indexes on admission number, email, name, course, year for fast queries
- ⭐ **Environment Variables** — All config externalized via `.env`
- ⭐ **Rate Limiting & Security Headers** — Helmet + express-rate-limit on the API

---

## 🧰 Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, React Router, Axios, Recharts, React Hot Toast, React Icons |
| Backend | Node.js, Express.js |
| Database | PostgreSQL |
| File Upload | Multer |
| Validation | express-validator |
| Security | Helmet, express-rate-limit, CORS |

---

## 📁 Project Structure

```
student-management/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js        # PostgreSQL connection pool
│   │   │ 
│   │   ├── controllers/
│   │   │   └── studentController.js
│   │   ├── middleware/
│   │   │   ├── validation.js      # express-validator rules
│   │   │   └── upload.js          # Multer config for photo upload
│   │   ├── routes/
│   │   │   └── studentRoutes.js
│   │   └── index.js               # Express app entry point
│   ├── uploads/                   # Uploaded student photos
│   ├── .gitignore
│   └── package.json
│
├── frontend/
│   │── index.html   
│   ├── src/
│   │   ├── components/
│   │   │   └── Layout.js          # Sidebar + topbar shell
│   │   ├── pages/
│   │   │   ├── Dashboard.js       # Analytics dashboard
│   │   │   ├── StudentList.js     # List, search, filter, paginate
│   │   │   ├── AddStudent.js      # Add student form
│   │   │   ├── EditStudent.js     # Edit student form
│   │   │   ├── StudentDetail.js   # Single student view
│   │   │   └── ActivityLogs.js    # Activity log table
│   │   ├── services/
│   │   │   └── api.js             # Axios API client
│   │   ├── App.js                 # Routes
│   │   └── index.js               
│   ├── .env.example
│   ├── .gitignore
│   └── package.json
│
└── README.md
```

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js v16 or higher
- PostgreSQL v13 or higher
- npm or yarn

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd student-management
```

### 2. Database Setup

Create a PostgreSQL database and run the schema file:

```bash
# Create the database
createdb student_management

# Run the schema (creates tables, indexes, triggers, functions)
psql -d student_management -f backend/src/config/schema.sql
```

Or using `psql` interactively:
```sql
CREATE DATABASE student_management;
\c student_management
\i backend/src/config/schema.sql
```

### 3. Backend Setup

```bash
cd backend
npm install

# A ready-to-use .env is already included for quick local setup.
# .env.example is the reference/sample copy — edit .env if your
# PostgreSQL credentials differ from the defaults:
# DB_USER=postgres, DB_PASSWORD=postgres123, DB_NAME=student_management

npm run dev   # starts on http://localhost:5000 (with nodemon)
# or
npm start     # production start
```

### 4. Frontend Setup

```bash
cd frontend
npm install

# A ready-to-use .env is already included for quick local setup.
# .env.example is the reference/sample copy — edit REACT_APP_API_URL
# if your backend runs on a different host/port.

npm start     # starts on http://localhost:3000
```

### 5. Open the app

Navigate to `http://localhost:3000` in your browser. The backend API runs at `http://localhost:5000/api`.

---

## 🗄️ Database Schema

**`students` table**

| Column | Type | Constraints |
|---|---|---|
| id | UUID | Primary Key, default `uuid_generate_v4()` |
| admission_number | VARCHAR(20) | **UNIQUE, NOT NULL**, auto-generated |
| name | VARCHAR(100) | NOT NULL |
| email | VARCHAR(150) | UNIQUE, NOT NULL |
| mobile_number | VARCHAR(15) | NOT NULL |
| date_of_birth | DATE | NOT NULL |
| gender | VARCHAR(10) | CHECK (Male/Female/Other) |
| course | VARCHAR(100) | NOT NULL |
| year | INTEGER | CHECK (1–6) |
| address | TEXT | NOT NULL |
| photo_url | VARCHAR(500) | nullable, stores relative path |
| created_at | TIMESTAMPTZ | default now |
| updated_at | TIMESTAMPTZ | auto-updated via trigger |

**`activity_logs` table** (bonus) — tracks CREATE/UPDATE/DELETE actions with JSONB details and timestamps.

**Admission number generation**: A PostgreSQL function `generate_admission_number()` produces unique IDs in the format `ADM<YEAR><4-digit sequence>` (e.g. `ADM20260007`), guaranteeing uniqueness per year.

**Indexes**: B-tree indexes on `admission_number`, `email`, `name`, `course`, `year`, `created_at`, plus a GIN full-text search index across name/email/admission_number/course for fast search queries.

---

## 🔌 API Endpoints

Base URL: `http://localhost:5000/api`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/students` | Fetch all students (supports `search`, `course`, `year`, `gender`, `page`, `limit`, `sort`, `order` query params) |
| GET | `/students/:id` | Fetch a single student by ID |
| POST | `/students` | Create a new student (multipart form-data, field `photo` for image) |
| PUT | `/students/:id` | Update an existing student |
| DELETE | `/students/:id` | Delete a student |
| GET | `/students/analytics` | Dashboard analytics (totals, distributions, enrollment trend) |
| GET | `/students/logs` | Paginated activity log |
| GET | `/health` | API health check |

**Example: Create Student (multipart/form-data)**
```
POST /api/students
Content-Type: multipart/form-data

name: John Doe
email: john@example.com
mobile_number: 9876543210
date_of_birth: 2003-05-14
gender: Male
course: Computer Science
year: 2
address: 123 Main St, City, State
photo: <file>
```

**Example response**
```json
{
  "success": true,
  "data": {
    "id": "a1b2c3d4-...",
    "admission_number": "ADM20260001",
    "name": "John Doe",
    "email": "john@example.com",
    "...": "..."
  },
  "message": "Student added successfully"
}
```

**Example: Get Students with search & pagination**
```
GET /api/students?search=john&course=Computer&page=1&limit=10
```

---

## 🔐 Environment Variables

Working `.env` files are already included in `backend/` and `frontend/` so the project runs out of the box against a local PostgreSQL instance. `.env.example` in each folder is the reference/sample copy.

**backend/.env**
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=student_management
DB_USER=postgres
DB_PASSWORD=postgres123
PORT=5000
NODE_ENV=development
UPLOAD_DIR=uploads
MAX_FILE_SIZE=5242880
FRONTEND_URL=http://localhost:5173
```

**frontend/.env**
```
VITE_API_URL==http://localhost:5001/api
```

---

## 🧪 Validation Rules

| Field | Rule |
|---|---|
| Name | Required, 2–100 chars, letters/spaces/punctuation only |
| Email | Required, valid format, unique |
| Mobile | Required, valid 10-digit number |
| DOB | Required, age between 15–60 years |
| Gender | Required, one of Male/Female/Other |
| Course | Required, 2–100 chars |
| Year | Required, integer 1–6 |
| Address | Required, 10–500 chars |
| Photo | Optional, JPEG/PNG/WebP, max 5MB |

All rules are enforced on both the **frontend** (instant feedback) and **backend** (via `express-validator`, source of truth).

---

## 📸 Screenshots

> Add screenshots of the Dashboard, Student List, Add/Edit forms, and Student Detail page here after deployment.

---

## 🚀 Deployment Notes

- **Frontend**: Build with `npm run build` in `frontend/`, deploy the `build/` folder to Vercel, Netlify, or any static host.
- **Backend**: Deploy to Render, Railway, or any Node host; ensure `uploads/` is on persistent storage (or migrate to S3/Cloudinary for production).
- **Database**: Use a managed PostgreSQL instance (Render, Supabase, Railway, AWS RDS, etc.) and run `schema.sql` against it before first use.
- Remember to update `FRONTEND_URL` (backend) and `REACT_APP_API_URL` (frontend) to your deployed URLs.

---

