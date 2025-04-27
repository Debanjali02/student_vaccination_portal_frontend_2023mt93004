import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './GenerateReports.css'; // Add your styles here

const GenerateReports = () => {
  const [records, setRecords] = useState([]);
  const [vaccineFilter, setVaccineFilter] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    fetchVaccinationReport();
  }, [vaccineFilter, page]);

  const fetchVaccinationReport = () => {
    axios
      .get('http://localhost:8080/api/reports/vaccination', {
        params: {
          vaccine: vaccineFilter,
          page: page,
          size: pageSize,
        },
      })
      .then((response) => {
        setRecords(response.data.content);
        setTotalPages(response.data.totalPages);
      })
      .catch((error) => {
        console.error('Error fetching report:', error);
        alert('Could not fetch report data.');
      });
  };

  const handleDownload = () => {
    axios
      .get('http://localhost:8080/api/reports/vaccination/download', {
        params: { vaccine: vaccineFilter },
        responseType: 'blob',
      })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'vaccination_report.xlsx');
        document.body.appendChild(link);
        link.click();
        link.remove();
      })
      .catch((error) => {
        console.error('Error downloading report:', error);
        alert('Failed to download the report.');
      });
  };

  return (
    <div className="generate-reports-container">
      <h2>Generate Vaccination Reports</h2>

      {/* Filter and Download */}
      <div className="filter-bar">
        <input
          type="text"
          placeholder="Filter by vaccine name..."
          value={vaccineFilter}
          onChange={(e) => {
            setVaccineFilter(e.target.value);
            setPage(0); // Reset to page 1 when filter changes
          }}
        />
        <button onClick={handleDownload}>Download Report</button>
      </div>

      {/* Vaccination Report Table */}
      <table className="report-table">
        <thead>
          <tr>
            <th>Student Name</th>
            <th>Class</th>
            <th>Vaccine Name</th>
            <th>Vaccination Date</th>
            <th>Vaccinated</th>
          </tr>
        </thead>
        <tbody>
          {records.length > 0 ? (
            records.map((record) => (
              <tr key={record.id}>
                <td>{record.student.name}</td>
                <td>{record.student.studentClass}</td>
                <td>{record.vaccineName}</td>
                <td>{record.vaccinationDate}</td>
                <td>{record.vaccinated ? 'Yes' : 'No'}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center' }}>No records found.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="pagination-controls">
        <button
          disabled={page === 0}
          onClick={() => setPage(page - 1)}
        >
          Previous
        </button>
        <span>Page {page + 1} of {totalPages}</span>
        <button
          disabled={page + 1 >= totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default GenerateReports;
