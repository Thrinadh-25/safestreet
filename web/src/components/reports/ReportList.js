

// import React, { useEffect, useState } from 'react';
// import { getAllReports } from '../../utils/api'; // ✅ Make sure this is correct path

// const ReportList = () => {
//   const [reports, setReports] = useState([]);

//   useEffect(() => {
//     const getReports = async () => {
//       try {
//         const response = await getAllReports(); // ✅ Axios returns { data: [...] }
//         console.log('Fetched Reports:', response.data);
//         setReports(response.data); // ✅ Use response.data
//       } catch (error) {
//         console.error('Error fetching reports:', error);
//       }
//     };

//     getReports();
//   }, []);

//   return (
//     <div>
//       <h2>Damage Reports</h2>
//       <ul>
//         {reports.length === 0 ? (
//           <li>No reports found.</li>
//         ) : (
//           reports.map((report) => (
//             <li key={report.id}>
//               <strong>{report.damageType}</strong> ({report.severity}) <br />
//               Priority: {report.priority} <br />
//               Date: {new Date(report.createdAt).toLocaleString()} <br />
//               <img
//                 src={`http://localhost:5000${report.annotatedImage}`}
//                 alt="Annotated Damage"
//                 width="200"
//               />
//               <br />
//               Summary: {report.summary}
//             </li>
//           ))
//         )}
//       </ul>
//     </div>
//   );
// };

// export default ReportList;


import React, { useEffect, useState } from 'react';
import { getAllReports } from '../../utils/api'; // Adjust path if needed

const ReportList = () => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const getReports = async () => {
      try {
        // getAllReports already returns the actual data array
        const data = await getAllReports();
        console.log("📄 Reports Data:", data);
        setReports(data);
      } catch (error) {
        console.error("❌ Error fetching reports:", error.message);
      }
    };

    getReports();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Damage Reports</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {reports.length === 0 ? (
          <li>🚫 No reports found.</li>
        ) : (
          reports.map((report) => (
            <li
              key={report.id}
              style={{
                border: '1px solid #ccc',
                borderRadius: '10px',
                padding: '15px',
                marginBottom: '20px',
              }}
            >
              <p><strong>Severity:</strong> {report.severity}</p>
              <p><strong>Priority:</strong> {report.priority}</p>
              <p><strong>Date:</strong> {new Date(report.createdAt).toLocaleString()}</p>
              <img
                src={`http://localhost:3000${report.annotatedImage}`}
                alt="Annotated Damage"
                width="300"
                style={{ marginTop: '10px', borderRadius: '8px' }}
              />
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default ReportList;

