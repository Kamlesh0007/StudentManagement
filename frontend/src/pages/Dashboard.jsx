import React, { useEffect, useState } from 'react';
import { studentService, getImageUrl } from '../services/api';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import toast from 'react-hot-toast';
import { FiUsers, FiBookOpen, FiUserCheck, FiTrendingUp, FiPieChart, FiBarChart2, FiClock } from 'react-icons/fi';
import { FaGraduationCap } from 'react-icons/fa';

function Dashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const { data } = await studentService.getAnalytics();
        setAnalytics(data.data);
      } catch (err) {
        toast.error('Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="loading-wrap">
        <div className="spinner"></div>
        <p>Loading analytics...</p>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="empty-state">
        <div className="empty-icon"><FiBarChart2 /></div>
        <div className="empty-title">No Data</div>
      </div>
    );
  }

  const COLORS = ['#6366f1', '#a78bfa', '#c4b5fd', '#ddd6fe', '#ede9fe', '#f3e8ff'];

  return (
    <div>
      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(34, 197, 94, 0.15)', color: '#22c55e' }}>
            <FiUsers />
          </div>
          <div className="stat-info">
            <h3>{analytics.total}</h3>
            <p>Total Students</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6' }}>
            <FiBookOpen />
          </div>
          <div className="stat-info">
            <h3>{analytics.byCourse?.length || 0}</h3>
            <p>Courses</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
            <FaGraduationCap />
          </div>
          <div className="stat-info">
            <h3>{analytics.byYear?.length || 0}</h3>
            <p>Years</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#a855f7' }}>
            <FiUserCheck />
          </div>
          <div className="stat-info">
            <h3>{analytics.byGender?.length || 0}</h3>
            <p>Genders</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="charts-grid">
        {/* Enrollment Trend */}
        <div className="card">
          <div className="card-header">
            <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FiTrendingUp /> Enrollment Trend (6 Months)
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analytics.enrollmentTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <Tooltip
                contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                labelStyle={{ color: '#f1f5f9' }}
              />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#6366f1"
                dot={{ fill: '#6366f1', r: 5 }}
                activeDot={{ r: 7 }}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Students by Course */}
        <div className="card">
          <div className="card-header">
            <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FiBookOpen /> Students by Course
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.byCourse.slice(0, 6)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
<XAxis
  dataKey="course"
  tickFormatter={(value) =>
    value.length > 12
      ? value.substring(0, 12) + "..."
      : value
  }
/>
              <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <Tooltip
                contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                labelStyle={{ color: '#f1f5f9' }}
              />
              <Bar dataKey="count" fill="#818cf8" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Gender Distribution */}
        <div className="card">
          <div className="card-header">
            <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FiPieChart /> Gender Distribution
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
   <Pie
  data={analytics.byGender}
  cx="50%"
  cy="50%"
  outerRadius={90}
  dataKey="count"
  nameKey="gender"
>
  <Legend
  verticalAlign="bottom"
  height={36}
/>
                {analytics.byGender.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                labelStyle={{ color: '#f1f5f9' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Students by Year */}
        <div className="card">
          <div className="card-header">
            <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FaGraduationCap /> Students by Year
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.byYear}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
  <XAxis
  dataKey="year"
  tickFormatter={(value) => {
    if (value === 1) return "1st";
    if (value === 2) return "2nd";
    if (value === 3) return "3rd";
    return `${value}th`;
  }}
/>
              <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <Tooltip
                contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                labelStyle={{ color: '#f1f5f9' }}
              />
              <Bar dataKey="count" fill="#a78bfa" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Students */}
      {analytics.recentStudents && analytics.recentStudents.length > 0 && (
        <div className="card" style={{ marginTop: '24px' }}>
          <div className="card-header">
            <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FiClock /> Recently Added Students
            </div>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Course</th>
                  <th>Year</th>
                  <th>Added On</th>
                </tr>
              </thead>
              <tbody>
                {analytics.recentStudents.map(student => (
                  <tr key={student.id}>
                    <td>
                      <div className="student-info">
                        {student.photo_url ? (
                          <img src={getImageUrl(student.photo_url)} alt={student.name} className="student-avatar" />
                        ) : (
                          <div className="student-avatar-placeholder">
                            {student.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <div className="student-name">{student.name}</div>
                        </div>
                      </div>
                    </td>
                    <td>{student.course}</td>
                    <td>
<span className="badge badge-year">
  {student.year === 1 || student.year === "1"
    ? "1st Year"
    : student.year === 2 || student.year === "2"
    ? "2nd Year"
    : student.year === 3 || student.year === "3"
    ? "3rd Year"
    : `${student.year}th Year`}
</span>
                    </td>
                    <td>{new Date(student.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;