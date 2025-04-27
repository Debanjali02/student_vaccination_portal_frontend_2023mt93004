import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';  // For navigation links
import './OverviewPage.css';  // Importing CSS for styling

const OverviewPage = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:8080/api/dashboard/overview')
      .then(response => {
        setDashboardData(response.data);
        setLoading(false);  // Data fetched successfully
      })
      .catch(error => {
        setError('Failed to fetch data');
        setLoading(false);  // Set loading to false in case of error
      });
  }, []);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="overview-page">
      {/* Left Sidebar Navigation */}
      <div className="navigation-menu">
        <ul>
          <li><Link to="/students/manage">Add/Manage Students</Link></li>
          <li><Link to="/vaccination/manage">Manage Vaccination Status</Link></li>
          <li><Link to="/reports/generate">Generate Reports</Link></li>
        </ul>
      </div>

      {/* Main Content Area (Dashboard Overview) */}
      <div className="overview-container">
        {/* Page Heading */}
        <header className="page-heading">
          <h1>Vaccination Dashboard</h1>
        </header>

        <h2 className="title">Dashboard Overview</h2>

        <div className="stats-container">
          <div className="stat-item">
            <h3>Total Students</h3>
            <p>{dashboardData.totalStudents}</p>
          </div>

          <div className="stat-item">
            <h3>Vaccinated Students</h3>
            <p>{dashboardData.vaccinatedStudents}</p>
          </div>

          <div className="stat-item">
            <h3>Vaccination Percentage</h3>
            <p>{dashboardData.vaccinationPercentage.toFixed(2)}%</p>
          </div>
        </div>

        <h3 className="upcoming-drives-title">Upcoming Vaccination Drives:</h3>
        {dashboardData.upcomingDrives.length === 0 ? (
          <p className="no-upcoming-drives">No upcoming drives</p>
        ) : (
          <ul className="upcoming-drives-list">
            {dashboardData.upcomingDrives.map((drive, index) => (
              <li key={index} className="drive-item">
                <p><strong>Vaccine Name:</strong> {drive.vaccineName}</p>
                <p><strong>Scheduled Date:</strong> {drive.scheduledDate}</p>
                <p><strong>Classes Applicable:</strong> {drive.classesApplicable}</p>
                <p><strong>Doses Available:</strong> {drive.dosesAvailable}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default OverviewPage;
