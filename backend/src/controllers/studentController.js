import pool from '../config/db.js';
import { validationResult } from 'express-validator';

// Helper: log activity
const logActivity = async (action, student, details = {}) => {
  try {
    await pool.query(
      `INSERT INTO activity_logs (action, student_id, student_name, admission_number, details)
       VALUES ($1, $2, $3, $4, $5)`,
      [action, student?.id || null, student?.name || null, student?.admission_number || null, JSON.stringify(details)]
    );
  } catch (err) {
    console.error('Activity log error:', err.message);
  }
};

// GET /students - Fetch all students with search, filter, pagination
export const getStudents = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      course = '',
      year = '',
      gender = '',
      sort = 'created_at',
      order = 'DESC'
    } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const params = [];
    let whereClause = 'WHERE 1=1';
    let paramIndex = 1;

    // Search by name, email, admission number, course
    if (search) {
      whereClause += ` AND (
        name ILIKE $${paramIndex} OR
        email ILIKE $${paramIndex} OR
        admission_number ILIKE $${paramIndex} OR
        course ILIKE $${paramIndex} OR
        mobile_number ILIKE $${paramIndex}
      )`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    if (course) {
      whereClause += ` AND course ILIKE $${paramIndex}`;
      params.push(`%${course}%`);
      paramIndex++;
    }

    if (year) {
      whereClause += ` AND year = $${paramIndex}`;
      params.push(parseInt(year));
      paramIndex++;
    }

    if (gender) {
      whereClause += ` AND gender = $${paramIndex}`;
      params.push(gender);
      paramIndex++;
    }

    const allowedSorts = ['name', 'admission_number', 'course', 'year', 'created_at', 'email'];
    const safeSort = allowedSorts.includes(sort) ? sort : 'created_at';
    const safeOrder = order === 'ASC' ? 'ASC' : 'DESC';

    const countQuery = `SELECT COUNT(*) FROM students ${whereClause}`;
    const countResult = await pool.query(countQuery, params);
    const total = parseInt(countResult.rows[0].count);

    const dataQuery = `
      SELECT id, admission_number, name, email, mobile_number, date_of_birth,
             gender, course, year, address, photo_url, created_at, updated_at
      FROM students ${whereClause}
      ORDER BY ${safeSort} ${safeOrder}
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;
    params.push(parseInt(limit), offset);

    const result = await pool.query(dataQuery, params);

    res.json({
      success: true,
      data: result.rows,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (err) {
    console.error('getStudents error:', err);
    res.status(500).json({ success: false, message: 'Server error fetching students' });
  }
};

// GET /students/:id
export const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT id, admission_number, name, email, mobile_number, date_of_birth,
              gender, course, year, address, photo_url, created_at, updated_at
       FROM students WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error('getStudentById error:', err);
    res.status(500).json({ success: false, message: 'Server error fetching student' });
  }
};

// POST /students - Add new student
export const createStudent = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { name, email, mobile_number, date_of_birth, gender, course, year, address } = req.body;
const photo_url = req.file
  ? req.file.path
  : null;

    // Generate unique admission number
    const admResult = await pool.query('SELECT generate_admission_number() as adm_num');
    const admission_number = admResult.rows[0].adm_num;

    const result = await pool.query(
      `INSERT INTO students (admission_number, name, email, mobile_number, date_of_birth, gender, course, year, address, photo_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [admission_number, name, email, mobile_number, date_of_birth, gender, course, parseInt(year), address, photo_url]
    );

    const student = result.rows[0];
    await logActivity('CREATE', student, { course, year });

    res.status(201).json({ success: true, data: student, message: 'Student added successfully' });
  } catch (err) {

    if (err.code === '23505') {
      return res.status(409).json({ success: false, message: 'Email already registered' });
    }
    console.error('createStudent error:', err);
    res.status(500).json({ success: false, message: 'Server error creating student' });
  }
};

// PUT /students/:id - Update student
export const updateStudent = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
   
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { id } = req.params;
    const { name, email, mobile_number, date_of_birth, gender, course, year, address } = req.body;

    // Get existing student
    const existing = await pool.query('SELECT * FROM students WHERE id = $1', [id]);
    if (existing.rows.length === 0) {

      return res.status(404).json({ success: false, message: 'Student not found' });
    }
let photo_url = existing.rows[0].photo_url;
if (req.file) {
  photo_url = req.file.path;
}

    const result = await pool.query(
      `UPDATE students SET name=$1, email=$2, mobile_number=$3, date_of_birth=$4,
       gender=$5, course=$6, year=$7, address=$8, photo_url=$9
       WHERE id=$10 RETURNING *`,
      [name, email, mobile_number, date_of_birth, gender, course, parseInt(year), address, photo_url, id]
    );

    const student = result.rows[0];
    await logActivity('UPDATE', student, { updated_fields: Object.keys(req.body) });

    res.json({ success: true, data: student, message: 'Student updated successfully' });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ success: false, message: 'Email already in use by another student' });
    }
    console.error('updateStudent error:', err);
    res.status(500).json({ success: false, message: 'Server error updating student' });
  }
};

// DELETE /students/:id
export const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await pool.query('SELECT * FROM students WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const student = existing.rows[0];

    

    await pool.query('DELETE FROM students WHERE id = $1', [id]);
    await logActivity('DELETE', student);

    res.json({ success: true, message: `Student ${student.name} deleted successfully` });
  } catch (err) {
    console.error('deleteStudent error:', err);
    res.status(500).json({ success: false, message: 'Server error deleting student' });
  }
};

// GET /students/analytics - Dashboard stats
export const getAnalytics = async (req, res) => {
  try {
    const [totalResult, courseResult, yearResult, genderResult, recentResult] = await Promise.all([
      pool.query('SELECT COUNT(*) as total FROM students'),
      pool.query('SELECT course, CAST(COUNT(*) AS INTEGER) AS count FROM students GROUP BY course ORDER BY count DESC LIMIT 10'),
      pool.query('SELECT year, CAST(COUNT(*) AS INTEGER) AS count FROM students GROUP BY year ORDER BY year'),
      pool.query('SELECT gender, CAST(COUNT(*) AS INTEGER) AS count FROM students GROUP BY gender'),
      pool.query('SELECT id, admission_number, name, course, year, photo_url, created_at FROM students ORDER BY created_at DESC LIMIT 5')
    ]);

    // Monthly enrollment trend (last 6 months)
    const trendResult = await pool.query(`
      SELECT TO_CHAR(created_at, 'Mon YYYY') as month,
             DATE_TRUNC('month', created_at) as month_date,
             COUNT(*) as count
      FROM students
      WHERE created_at >= NOW() - INTERVAL '6 months'
      GROUP BY month, month_date
      ORDER BY month_date
    `);

    res.json({
      success: true,
      data: {
        total: parseInt(totalResult.rows[0].total),
        byCourse: courseResult.rows,
        byYear: yearResult.rows,
        byGender: genderResult.rows,
        recentStudents: recentResult.rows,
        enrollmentTrend: trendResult.rows
      }
    });
  } catch (err) {
    console.error('getAnalytics error:', err);
    res.status(500).json({ success: false, message: 'Server error fetching analytics' });
  }
};

// GET /activity-logs
export const getActivityLogs = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const countResult = await pool.query('SELECT COUNT(*) FROM activity_logs');
    const total = parseInt(countResult.rows[0].count);

    const result = await pool.query(
      `SELECT * FROM activity_logs ORDER BY performed_at DESC LIMIT $1 OFFSET $2`,
      [parseInt(limit), offset]
    );

    res.json({
      success: true,
      data: result.rows,
      pagination: { total, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(total / parseInt(limit)) }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error fetching logs' });
  }
};