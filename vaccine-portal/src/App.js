import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Auth/LoginPage';
import Overview from './components/Dashboard/OverviewPage';
import ManageStudents from './components/Students/ManageStudents';
import ManageVaccination from './components/Vaccination/ManageVaccination';
import GenerateReports from './components/Reports/GenerateReports';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Overview />} />
        <Route path="/students/manage" element={<ManageStudents />} />
        <Route path="/vaccination/manage" element={<ManageVaccination />} />
        <Route path="/reports/generate" element={<GenerateReports />} />
      </Routes>
    </Router>
  );
}

export default App;
