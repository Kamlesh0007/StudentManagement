-- Student Management System Database Schema
-- Run this file to initialize the database

-- Create database (run separately if needed)
-- CREATE DATABASE student_management;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Students table
CREATE TABLE IF NOT EXISTS students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admission_number VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  mobile_number VARCHAR(15) NOT NULL,
  date_of_birth DATE NOT NULL,
  gender VARCHAR(10) NOT NULL CHECK (gender IN ('Male', 'Female', 'Other')),
  course VARCHAR(100) NOT NULL,
  year INTEGER NOT NULL CHECK (year BETWEEN 1 AND 6),
  address TEXT NOT NULL,
  photo_url VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Activity logs table (bonus feature)
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  action VARCHAR(50) NOT NULL,
  student_id UUID REFERENCES students(id) ON DELETE SET NULL,
  student_name VARCHAR(100),
  admission_number VARCHAR(20),
  details JSONB,
  performed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_students_admission_number ON students(admission_number);
CREATE INDEX IF NOT EXISTS idx_students_email ON students(email);
CREATE INDEX IF NOT EXISTS idx_students_name ON students(name);
CREATE INDEX IF NOT EXISTS idx_students_course ON students(course);
CREATE INDEX IF NOT EXISTS idx_students_year ON students(year);
CREATE INDEX IF NOT EXISTS idx_students_created_at ON students(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_logs_student_id ON activity_logs(student_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_performed_at ON activity_logs(performed_at DESC);

-- Full-text search index
CREATE INDEX IF NOT EXISTS idx_students_search ON students 
  USING GIN (to_tsvector('english', name || ' ' || email || ' ' || admission_number || ' ' || course));

-- Function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for updated_at
DROP TRIGGER IF EXISTS update_students_updated_at ON students;
CREATE TRIGGER update_students_updated_at
  BEFORE UPDATE ON students
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to generate unique admission number
CREATE OR REPLACE FUNCTION generate_admission_number()
RETURNS VARCHAR AS $$
DECLARE
  year_part VARCHAR(4);
  seq_num INTEGER;
  adm_number VARCHAR(20);
BEGIN
  year_part := TO_CHAR(CURRENT_DATE, 'YYYY');
  
  SELECT COALESCE(MAX(
    CAST(SUBSTRING(admission_number FROM 9) AS INTEGER)
  ), 0) + 1
  INTO seq_num
  FROM students
  WHERE admission_number LIKE 'ADM' || year_part || '%';
  
  adm_number := 'ADM' || year_part || LPAD(seq_num::TEXT, 4, '0');
  RETURN adm_number;
END;
$$ LANGUAGE plpgsql;
