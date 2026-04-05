import React, { useState } from 'react';
import axios from 'axios';
import { Calendar, FileText, AlertCircle, User, Phone } from 'lucide-react';

const LeaveRequestForm = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    leaveType: 'annual',
    startDate: '',
    endDate: '',
    reason: '',
    priority: 'medium',
    emergencyContact: {
      name: '',
      relationship: '',
      phoneNumber: ''
    },
    backupArrangement: {
      employeeName: '',
      tasksDelegated: ''
    }
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const calculateDays = () => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      return diffDays;
    }
    return 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        '/api/leave/create',
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        onSuccess(response.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit leave request');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">New Leave Request</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded flex items-center">
          <AlertCircle className="w-5 h-5 mr-2" />
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Leave Type</label>
            <select
              name="leaveType"
              value={formData.leaveType}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
              required
            >
              <option value="annual">Annual Leave</option>
              <option value="sick">Sick Leave</option>
              <option value="casual">Casual Leave</option>
              <option value="unpaid">Unpaid Leave</option>
              <option value="maternity">Maternity Leave</option>
              <option value="paternity">Paternity Leave</option>
              <option value="bereavement">Bereavement Leave</option>
              <option value="study">Study Leave</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Priority</label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">End Date</label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
              required
            />
          </div>
        </div>
        
        {formData.startDate && formData.endDate && (
          <div className="bg-blue-50 p-3 rounded">
            <p className="text-sm text-blue-800">
              Total Days: <strong>{calculateDays()} day(s)</strong>
            </p>
          </div>
        )}
        
        <div>
          <label className="block text-sm font-medium mb-2">Reason for Leave</label>
          <textarea
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            rows="3"
            className="w-full border rounded-lg px-3 py-2"
            placeholder="Please provide detailed reason for your leave request..."
            required
          />
        </div>
        
        <div className="border-t pt-4">
          <h3 className="font-semibold mb-3 flex items-center">
            <User className="w-4 h-4 mr-2" />
            Emergency Contact
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              name="emergencyContact.name"
              placeholder="Contact Name"
              value={formData.emergencyContact.name}
              onChange={handleChange}
              className="border rounded-lg px-3 py-2"
            />
            <input
              type="text"
              name="emergencyContact.relationship"
              placeholder="Relationship"
              value={formData.emergencyContact.relationship}
              onChange={handleChange}
              className="border rounded-lg px-3 py-2"
            />
            <input
              type="tel"
              name="emergencyContact.phoneNumber"
              placeholder="Phone Number"
              value={formData.emergencyContact.phoneNumber}
              onChange={handleChange}
              className="border rounded-lg px-3 py-2"
            />
          </div>
        </div>
        
        <div className="border-t pt-4">
          <h3 className="font-semibold mb-3">Backup Arrangement</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="backupArrangement.employeeName"
              placeholder="Backup Employee Name"
              value={formData.backupArrangement.employeeName}
              onChange={handleChange}
              className="border rounded-lg px-3 py-2"
            />
            <textarea
              name="backupArrangement.tasksDelegated"
              placeholder="Tasks delegated to backup (optional)"
              value={formData.backupArrangement.tasksDelegated}
              onChange={handleChange}
              rows="2"
              className="border rounded-lg px-3 py-2"
            />
          </div>
        </div>
        
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit Request'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LeaveRequestForm;