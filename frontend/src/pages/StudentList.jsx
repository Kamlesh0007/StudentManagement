import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { studentService, getImageUrl } from '../services/api';
import toast from 'react-hot-toast';
import {
  FiSearch, FiRefreshCw, FiEye, FiEdit2, FiTrash2, FiChevronsLeft,
  FiChevronsRight, FiChevronLeft, FiChevronRight, FiUserX, FiTrash, FiX
} from 'react-icons/fi';

function StudentList() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ course: '', year: '', gender: '' });
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [courses, setCourses] = useState([]);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    fetchStudents();
  }, [pagination.page,debouncedSearch, filters]);

  useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedSearch(search);
  }, 500);

  return () => clearTimeout(timer);
}, [search]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
const { data } = await studentService.getAll({
  page: pagination.page,
  limit: pagination.limit,
  search: debouncedSearch,
  ...filters,
});
      setStudents(data.data);
      setPagination(data.pagination);

      // Extract unique courses for filter dropdown
      if (data.data.length > 0) {
        const uniqueCourses = [...new Set(data.data.map(s => s.course))];
        setCourses(uniqueCourses);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await studentService.delete(deleteId);
      toast.success('Student deleted successfully');
      setDeleteId(null);
      fetchStudents();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDeleting(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPagination({ ...pagination, page: 1 });
  };

  const handleFilterChange = (field, value) => {
    setFilters({ ...filters, [field]: value });
    setPagination({ ...pagination, page: 1 });
  };

  const handlePageChange = (newPage) => {
    setPagination({ ...pagination, page: newPage });
  };

  return (
    <div>
      {/* Search & Filters */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <div className="search-bar">
          <div className="search-input-wrap">
            <span className="search-icon"><FiSearch /></span>
            <input
              type="text"
              placeholder="Search by name, email, admission number..."
              value={search}
              onChange={handleSearchChange}
              className="search-input"
            />
          </div>

          <select
            className="filter-select"
            value={filters.course}
            onChange={(e) => handleFilterChange('course', e.target.value)}
          >
            <option value="">All Courses</option>
            {courses.map(course => (
              <option key={course} value={course}>{course}</option>
            ))}
          </select>

          <select
            className="filter-select"
            value={filters.year}
            onChange={(e) => handleFilterChange('year', e.target.value)}
          >
            <option value="">All Years</option>
            {[1, 2, 3, 4, 5, 6].map(year => (
              <option key={year} value={year}>Year {year}</option>
            ))}
          </select>

          <select
            className="filter-select"
            value={filters.gender}
            onChange={(e) => handleFilterChange('gender', e.target.value)}
          >
            <option value="">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

          <button
            className="btn btn-secondary btn-sm"
            onClick={() => {
              setSearch('');
              setFilters({ course: '', year: '', gender: '' });
            }}
          >
            <FiRefreshCw /> Reset
          </button>
        </div>
      </div>

      {/* Students Table */}
      <div className="card">
        {loading ? (
          <div className="loading-wrap">
            <div className="spinner"></div>
            <p>Loading students...</p>
          </div>
        ) : students.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon"><FiUserX /></div>
            <div className="empty-title">No students found</div>
            <div className="empty-desc">
              {search || Object.values(filters).some(v => v)
                ? 'Try adjusting your search or filters'
                : 'Add your first student to get started'}
            </div>
          </div>
        ) : (
          <>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Student Info</th>
                    <th>Admission #</th>
                    <th>Email</th>
                    <th>Course</th>
                    <th>Year</th>
                    <th>Gender</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map(student => (
                    <tr key={student.id}>
                      <td>
                        <div className="student-info">
                          {student.photo_url ? (
                            <img
                              src={getImageUrl(student.photo_url)}
                              alt={student.name}
                              className="student-avatar"
                            />
                          ) : (
                            <div className="student-avatar-placeholder">
                              {student.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <div className="student-name">{student.name}</div>
                            <div className="student-adm">{student.mobile_number}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <code style={{ background: 'var(--accent-bg)', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '600' }}>
                          {student.admission_number}
                        </code>
                      </td>
                      <td style={{ fontSize: '13px' }}>{student.email}</td>
                      <td>{student.course}</td>
                      <td>
                        <span className="badge badge-year">Year {student.year}</span>
                      </td>
                      <td>
                        <span className={`badge badge-gender-${student.gender === 'Male' ? 'm' : student.gender === 'Female' ? 'f' : 'o'}`}>
                          {student.gender}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '4px' }}>
                          <button
                            className="btn-icon"
                            onClick={() => navigate(`/students/${student.id}`)}
                            title="View details"
                          >
                            <FiEye />
                          </button>
                          <button
                            className="btn-icon"
                            onClick={() => navigate(`/students/edit/${student.id}`)}
                            title="Edit student"
                          >
                            <FiEdit2 />
                          </button>
                          <button
                            className="btn-icon danger"
                            onClick={() => setDeleteId(student.id)}
                            title="Delete student"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="pagination">
              <div className="pagination-info">
                Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
                {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} students
              </div>
              <div className="pagination-btns">
                <button
                  className="page-btn"
                  onClick={() => handlePageChange(1)}
                  disabled={pagination.page === 1}
                >
                  <FiChevronsLeft />
                </button>
                <button
                  className="page-btn"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                >
                  <FiChevronLeft />
                </button>

                {[...Array(pagination.totalPages)].map((_, i) => {
                  const pageNum = i + 1;
                  if (
                    pageNum === 1 ||
                    pageNum === pagination.totalPages ||
                    (pageNum >= pagination.page - 1 && pageNum <= pagination.page + 1)
                  ) {
                    return (
                      <button
                        key={pageNum}
                        className={`page-btn ${pageNum === pagination.page ? 'active' : ''}`}
                        onClick={() => handlePageChange(pageNum)}
                      >
                        {pageNum}
                      </button>
                    );
                  } else if (pageNum === pagination.page - 2 || pageNum === pagination.page + 2) {
                    return <span key={pageNum} style={{ padding: '0 4px', color: 'var(--text-muted)' }}>...</span>;
                  }
                  return null;
                })}

                <button
                  className="page-btn"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                >
                  <FiChevronRight />
                </button>
                <button
                  className="page-btn"
                  onClick={() => handlePageChange(pagination.totalPages)}
                  disabled={pagination.page === pagination.totalPages}
                >
                  <FiChevronsRight />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FiTrash /> Delete Student
            </div>
            <div className="modal-desc">Are you sure you want to delete this student? This action cannot be undone.</div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setDeleteId(null)} disabled={deleting}>
                <FiX /> Cancel
              </button>
              <button
                className="btn btn-danger"
                onClick={handleDelete}
                disabled={deleting}
              >
                <FiTrash2 /> {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentList;