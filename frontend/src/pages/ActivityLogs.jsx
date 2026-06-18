import React, { useEffect, useState } from 'react';
import { studentService } from '../services/api';
import toast from 'react-hot-toast';
import {
  FiActivity, FiCheckCircle, FiEdit2, FiTrash2, FiFileText, FiInbox,
  FiChevronsLeft, FiChevronsRight, FiChevronLeft, FiChevronRight
} from 'react-icons/fi';

function ActivityLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 0 });

  useEffect(() => {
    fetchLogs();
  }, [pagination.page]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const { data } = await studentService.getLogs({
        page: pagination.page,
        limit: pagination.limit
      });
      setLogs(data.data);
      setPagination(data.pagination);
    } catch (err) {
      toast.error('Failed to load activity logs');
    } finally {
      setLoading(false);
    }
  };

  const getActionBadgeClass = (action) => {
    switch (action) {
      case 'CREATE':
        return 'action-create';
      case 'UPDATE':
        return 'action-update';
      case 'DELETE':
        return 'action-delete';
      default:
        return '';
    }
  };

  const getActionIcon = (action) => {
    switch (action) {
      case 'CREATE':
        return <FiCheckCircle />;
      case 'UPDATE':
        return <FiEdit2 />;
      case 'DELETE':
        return <FiTrash2 />;
      default:
        return <FiFileText />;
    }
  };

  const handlePageChange = (newPage) => {
    setPagination({ ...pagination, page: newPage });
  };

  return (
    <div className="card">
      <div className="card-header" style={{ marginBottom: '20px' }}>
        <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FiActivity /> Activity Logs
        </div>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
          Track all student management activities
        </p>
      </div>

      {loading ? (
        <div className="loading-wrap">
          <div className="spinner"></div>
          <p>Loading activity logs...</p>
        </div>
      ) : logs.length === 0 ? (
        <div className="empty-state" style={{ paddingTop: '40px', paddingBottom: '40px' }}>
          <div className="empty-icon"><FiInbox /></div>
          <div className="empty-title">No Activities Yet</div>
          <div className="empty-desc">Activities will appear here as you manage students</div>
        </div>
      ) : (
        <>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Action</th>
                  <th>Student Info</th>
                  <th>Admission #</th>
                  <th>Details</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {logs.map(log => (
                  <tr key={log.id}>
                    <td>
                      <span className={`action-badge ${getActionBadgeClass(log.action)}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                        {getActionIcon(log.action)} {log.action}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontSize: '14px', fontWeight: '500' }}>
                        {log.student_name || '—'}
                      </div>
                    </td>
                    <td>
                      <code style={{ background: 'var(--accent-bg)', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '600' }}>
                        {log.admission_number || '—'}
                      </code>
                    </td>
                    <td>
                      {log.details ? (
                        <details>
                          <summary style={{ cursor: 'pointer', color: 'var(--accent-light)', fontSize: '12px', fontWeight: '600' }}>
                            View Details
                          </summary>
               <pre
  style={{
    background: 'var(--bg-primary)',
    padding: '8px',
    borderRadius: '4px',
    fontSize: '11px',
    color: 'var(--text-muted)',
    marginTop: '8px',
    maxHeight: '150px',
    overflow: 'auto'
  }}
>
  {JSON.stringify(
    typeof log.details === "string"
      ? JSON.parse(log.details)
      : log.details,
    null,
    2
  )}
</pre>
                        </details>
                      ) : (
                        <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>—</span>
                      )}
                    </td>
                    <td style={{ fontSize: '12px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                      {new Date(log.performed_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
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
              {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} logs
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
  );
}

export default ActivityLogs;