import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ManageVaccination.css';

const getDriveStatus = (dateStr) => {
  const today = new Date();
  const scheduled = new Date(dateStr);
  return scheduled < today ? 'Completed' : 'Upcoming';
};

const ManageVaccination = () => {
  const [formData, setFormData] = useState({
    vaccineName: '',
    scheduledDate: '',
    dosesAvailable: '',
    classesApplicable: '',
  });

  const [editData, setEditData] = useState({});
  const [approvedDrives, setApprovedDrives] = useState([]);
  const [pendingDrives, setPendingDrives] = useState([]);

  useEffect(() => {
    fetchApprovedDrives();
    fetchPendingDrives();
  }, []);

  const fetchPendingDrives = () => {
    axios.get('http://localhost:8080/api/vaccination-drives/pending')
      .then(res => setPendingDrives(res.data))
      .catch(err => console.error('Error fetching pending drives:', err));
  };

  const fetchApprovedDrives = () => {
    axios.get('http://localhost:8080/api/vaccination-drives/approved')
      .then(res => setApprovedDrives(res.data))
      .catch(err => console.error('Error fetching approved drives:', err));
  };

  const handleInputChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8080/api/vaccination-drives/request', formData)
      .then(() => {
        alert('Drive request submitted!');
        setFormData({ vaccineName: '', scheduledDate: '', dosesAvailable: '', classesApplicable: '' });
        fetchPendingDrives();
      })
      .catch(err => {
        console.error('Error submitting drive:', err);
        alert('Failed to submit drive.');
      });
  };

  const approveDrive = (id) => {
    axios.put(`http://localhost:8080/api/vaccination-drives/approve/${id}`)
      .then(() => {
        alert('Drive approved!');
        fetchPendingDrives();
        fetchApprovedDrives();
      })
      .catch(err => {
        console.error('Approval failed:', err);
        alert('Approval failed!');
      });
  };

  const handleEditChange = (id, field, value) => {
    setEditData(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value
      }
    }));
  };

  const handleUpdateDrive = (id) => {
    const originalDrive = approvedDrives.find(d => d.id === id);

    const updatedDrive = {
      vaccineName: originalDrive.vaccineName,
      classesApplicable: originalDrive.classesApplicable,
      scheduledDate: editData[id]?.scheduledDate || originalDrive.scheduledDate,
      dosesAvailable: editData[id]?.dosesAvailable || originalDrive.dosesAvailable,
    };

    axios.put(`http://localhost:8080/api/vaccination-drives/${id}`, updatedDrive)
      .then(() => {
        alert('Drive updated successfully!');
        fetchApprovedDrives();
      })
      .catch(err => {
        console.error('Update failed:', err);
        alert('Failed to update drive.');
      });
  };

  return (
    <div className="manage-vaccination-container">
      <h2>Manage Vaccination Drives</h2>

      {/* Book Vaccination Drive */}
      <section className="drive-form-section">
        <h3>Book a Vaccination Drive</h3>
        <form onSubmit={handleFormSubmit} className="drive-form">
          <input
            type="text"
            name="vaccineName"
            placeholder="Vaccine Name"
            value={formData.vaccineName}
            onChange={handleInputChange}
            required
          />
          <input
            type="date"
            name="scheduledDate"
            value={formData.scheduledDate}
            onChange={handleInputChange}
            required
          />
          <input
            type="number"
            name="dosesAvailable"
            placeholder="Number of Doses"
            value={formData.dosesAvailable}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="classesApplicable"
            placeholder="Applicable Classes (e.g., 1,2,3)"
            value={formData.classesApplicable}
            onChange={handleInputChange}
            required
          />
          <button type="submit">Submit Drive Request</button>
        </form>
      </section>

      {/* Pending Drives */}
      <section className="drive-list-section">
        <h3>Pending Approval Drives</h3>
        {pendingDrives.length ? (
          <table className="drive-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Vaccine</th>
                <th>Date</th>
                <th>Doses</th>
                <th>Classes</th>
                <th>Status</th>
                <th>Drive Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {pendingDrives.map(drive => (
                <tr key={drive.id}>
                  <td>{drive.id}</td>
                  <td>{drive.vaccineName}</td>
                  <td>{drive.scheduledDate}</td>
                  <td>{drive.dosesAvailable}</td>
                  <td>{drive.classesApplicable}</td>
                  <td>{drive.isApproved ? 'Approved' : 'Pending'}</td>
                  <td>{getDriveStatus(drive.scheduledDate)}</td>
                  <td><button onClick={() => approveDrive(drive.id)}>Approve</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : <p>No pending drives.</p>}
      </section>

      {/* Approved Drives (Editable if Upcoming) */}
      <section className="drive-list-section">
        <h3>Approved Drives</h3>
        {approvedDrives.length ? (
          <table className="drive-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Vaccine</th>
                <th>Date</th>
                <th>Doses</th>
                <th>Classes</th>
                <th>Status</th>
                <th>Drive Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {approvedDrives.map(drive => {
                const editable = getDriveStatus(drive.scheduledDate) === 'Upcoming';
                return (
                  <tr key={drive.id}>
                    <td>{drive.id}</td>
                    <td>{drive.vaccineName}</td>
                    <td>
                      {editable ? (
                        <input
                          type="date"
                          value={editData[drive.id]?.scheduledDate || drive.scheduledDate}
                          onChange={(e) => handleEditChange(drive.id, 'scheduledDate', e.target.value)}
                        />
                      ) : drive.scheduledDate}
                    </td>
                    <td>
                      {editable ? (
                        <input
                          type="number"
                          value={editData[drive.id]?.dosesAvailable || drive.dosesAvailable}
                          onChange={(e) => handleEditChange(drive.id, 'dosesAvailable', e.target.value)}
                        />
                      ) : drive.dosesAvailable}
                    </td>
                    <td>{drive.classesApplicable}</td>
                    <td>{drive.isApproved ? 'Approved' : 'Pending'}</td>
                    <td>{getDriveStatus(drive.scheduledDate)}</td>
                    <td>
                      {editable && (
                        <button onClick={() => handleUpdateDrive(drive.id)}>Update</button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : <p>No approved drives.</p>}
      </section>
    </div>
  );
};

export default ManageVaccination;
