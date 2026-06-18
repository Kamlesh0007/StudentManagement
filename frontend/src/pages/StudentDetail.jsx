import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { studentService, getImageUrl } from '../services/api';
import toast from 'react-hot-toast';
import {
  FiEdit2, FiArrowLeft, FiUser, FiMail, FiPhone, FiCalendar,
  FiMapPin, FiCheckCircle, FiUsers, FiXCircle
} from 'react-icons/fi';
import { FaGraduationCap } from 'react-icons/fa';

function StudentDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const { data } = await studentService.getById(id);
        setStudent(data.data);
      } catch (err) {
        toast.error('Failed to load student details');
        navigate('/students');
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="loading-wrap">
        <div className="spinner"></div>
        <p>Loading student details...</p>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="empty-state">
        <div className="empty-icon"><FiXCircle /></div>
        <div className="empty-title">Student Not Found</div>
      </div>
    );
  }

  const calculateAge = (dob) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div>
      {/* Header with photo and basic info */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="detail-header">
          {student.photo_url ? (
            <img
              src={getImageUrl(student.photo_url)}
              alt={student.name}
              className="detail-avatar"
            />
          ) : (
            <div className="detail-avatar-placeholder">
              {student.name.charAt(0).toUpperCase()}
            </div>
          )}

          <div style={{ flex: 1 }}>
            <h1>{student.name}</h1>
            <div className="detail-adm">{student.admission_number}</div>

            <div className="detail-meta">
              <span className="badge badge-year">Year {student.year}</span>
              <span className={`badge badge-gender-${student.gender === 'Male' ? 'm' : student.gender === 'Female' ? 'f' : 'o'}`}>
                {student.gender}
              </span>
              <span className="badge" style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#d8b4fe' }}>
                {student.course}
              </span>
            </div>

            <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '12px' }}>
              Registered on {new Date(student.created_at).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              className="btn btn-primary"
              onClick={() => navigate(`/students/edit/${student.id}`)}
            >
              <FiEdit2 /> Edit
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => navigate('/students')}
            >
              <FiArrowLeft /> Back
            </button>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="card-header">
          <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FiUser /> Personal Information
          </div>
        </div>

        <div className="detail-fields">
          <div className="field-item">
            <label>Full Name</label>
            <p>{student.name}</p>
          </div>

      <div className="field-item">
  <label>Email Address</label>
  <p
    style={{
      display: "flex",
      alignItems: "flex-start",
      gap: "8px",
    }}
  >
    <FiMail
      style={{
        marginTop: "3px",
        flexShrink: 0,
      }}
    />
    <span
      style={{
        color: "var(--accent-light)",
        overflowWrap: "break-word",
        wordBreak: "break-word",
        lineHeight: 1.6,
      }}
    >
      {student.email}
    </span>
  </p>
</div>

          <div className="field-item">
            <label>Mobile Number</label>
            <p>
              <a href={`tel:${student.mobile_number}`} style={{ color: 'var(--accent-light)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <FiPhone /> {student.mobile_number}
              </a>
            </p>
          </div>

          <div className="field-item">
            <label>Date of Birth</label>
            <p style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FiCalendar />
              {new Date(student.date_of_birth).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })} ({calculateAge(student.date_of_birth)} years old)
            </p>
          </div>

          <div className="field-item">
            <label>Gender</label>
            <p style={{ textTransform: 'capitalize' }}>{student.gender}</p>
          </div>

          <div className="field-item">
            <label>Address</label>
            <p style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
              <FiMapPin style={{ marginTop: '3px', flexShrink: 0 }} /> {student.address}
            </p>
          </div>
        </div>
      </div>

      {/* Academic Information */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="card-header">
          <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FaGraduationCap /> Academic Information
          </div>
        </div>

        <div className="detail-fields">
          <div className="field-item">
            <label>Admission Number</label>
            <p>
              <code style={{ background: 'var(--accent-bg)', padding: '6px 12px', borderRadius: '6px', fontWeight: '600' }}>
                {student.admission_number}
              </code>
            </p>
          </div>

          <div className="field-item">
            <label>Course</label>
            <p>{student.course}</p>
          </div>

          <div className="field-item">
            <label>Year of Study</label>
<span className="badge badge-year">
  {student.year === 1 || student.year === "1"
    ? "1st Year"
    : student.year === 2 || student.year === "2"
    ? "2nd Year"
    : student.year === 3 || student.year === "3"
    ? "3rd Year"
    : `${student.year}th Year`}
</span>
          </div>

          <div className="field-item">
            <label>Enrollment Date</label>
            <p>{new Date(student.created_at).toLocaleDateString()}</p>
          </div>

          <div className="field-item">
            <label>Last Updated</label>
            <p>
              {new Date(student.updated_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">Status</div>
        </div>

        <div style={{ padding: '16px', background: 'var(--bg-primary)', borderRadius: 'var(--radius-sm)', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '20px', color: 'var(--success)', display: 'flex' }}><FiCheckCircle /></span>
            <div>
              <div style={{ fontWeight: '600', fontSize: '14px' }}>Active</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                Student is currently enrolled and active
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            className="btn btn-primary"
            onClick={() => navigate(`/students/edit/${student.id}`)}
          >
            <FiEdit2 /> Edit Details
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => navigate('/students')}
          >
            <FiUsers /> View All Students
          </button>
        </div>
      </div>
    </div>
  );
}

export default StudentDetail;