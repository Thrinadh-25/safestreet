import React, { useEffect, useState } from 'react';
import { getAllReports, getReportImageUrl } from '../../utils/api'; 


const ReportList = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data = await getAllReports();  // ✅ uses api.js now
        setReports(data);
      } catch (err) {
        console.error('Failed to fetch reports:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  if (loading) return <p>Loading reports...</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Damage Reports</h2>
      {reports.length === 0 ? (
        <p>No reports found.</p>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
          {reports.map((report) => (
            <div key={report.id} style={{
              border: '1px solid #ccc',
              borderRadius: '10px',
              padding: '15px',
              maxWidth: '300px',
              background: '#f9f9f9'
            }}>
              <img
                src={getReportImageUrl(report.id)}  // ✅ uses dynamic image URL
                alt="Annotated"
                style={{ width: '100%', borderRadius: '6px' }}
              />
              <h4>{report.damageType}</h4>
              <p><strong>Severity:</strong> {report.severity}</p>
              <p><strong>Priority:</strong> {report.priority}</p>
              <p><strong>Email:</strong> {report.email}</p>
              <p>{report.description}</p>
              <p style={{ fontSize: '12px', color: '#777' }}>
                {new Date(report.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReportList;
