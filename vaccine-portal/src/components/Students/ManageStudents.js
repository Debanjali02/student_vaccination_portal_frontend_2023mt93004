import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ManageStudents.css'; // Attach the CSS styling

const ManageStudents = () => {
  const [students, setStudents] = useState([]);
  const [studentForm, setStudentForm] = useState({
    name: '',
    studentClass: '',
    isVaccinated: ''
  });
  const [file, setFile] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = () => {
    axios.get('http://localhost:8080/api/students')
      .then(response => setStudents(response.data))
      .catch(error => console.error('Error fetching students:', error));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Handle isVaccinated dropdown as boolean
    if (name === "isVaccinated") {
      setStudentForm({ ...studentForm, [name]: value === "true" });
    } else {
      setStudentForm({ ...studentForm, [name]: value });
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8080/api/students/add', studentForm)
      .then(() => {
        alert('Student added successfully!');
        fetchStudents();
        setStudentForm({ name: '', studentClass: '', isVaccinated: '' });
      })
      .catch(error => {
        console.error('Error adding student:', error);
        alert('Failed to add student.');
      });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleBulkUpload = () => {
    if (!file) {
      alert('Please select a file first.');
      return;
    }
    const formData = new FormData();
    formData.append('file', file);

    axios.post('http://localhost:8080/api/students/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
      .then(() => {
        alert('Students uploaded successfully!');
        fetchStudents();
        setFile(null);
      })
      .catch(error => {
        console.error('Error uploading students:', error);
        alert('Failed to upload students.');
      });
  };

  return (
    <div className="manage-students-container">
      <h1 className="page-title">Manage Student Details</h1>

      {/* Add Single Student Form */}
      <section className="add-student-section">
        <h2>Add Individual Student</h2>
        <form onSubmit={handleFormSubmit} className="student-form">
          <input
            type="text"
            name="name"
            placeholder="Student Name"
            value={studentForm.name}
            onChange={handleInputChange}
            required
          />
          <input
            type="number"
            name="studentClass"
            placeholder="Student Class"
            value={studentForm.studentClass}
            onChange={handleInputChange}
            required
          />

          {/* Dropdown for Vaccination Status */}
          <select
            name="isVaccinated"
            value={studentForm.isVaccinated}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Vaccination Status</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>

          <button type="submit" className="submit-btn">Add Student</button>
        </form>
      </section>

      {/* Bulk Upload Section */}
      <section className="bulk-upload-section">
        <h2>Bulk Upload Students</h2>
        <div className="bulk-upload-form">
          <input type="file" onChange={handleFileChange} className="file-input" />
          <button onClick={handleBulkUpload} className="upload-btn">Upload File</button>
        </div>
      </section>

      {/* Students List Table */}
      <section className="students-list-section">
        <h2>All Students</h2>
        <table className="students-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Student Class</th>
              <th>Vaccination Status</th>
            </tr>
          </thead>
          <tbody>
            {students.length > 0 ? (
              students.map((student, index) => (
                <tr key={index}>
                  <td>{student.name}</td>
                  <td>{student.studentClass}</td>
                  <td>{student.isVaccinated ? 'Yes' : 'No'}</td> {/* <--- Updated here */}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" style={{ textAlign: 'center' }}>No students found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default ManageStudents;
