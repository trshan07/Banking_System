import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, CheckCircle, XCircle, Clock, Eye } from 'lucide-react';

const LeaveRequestList = ({ userRole }) => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  
  useEffect(() => {
    fetchLeaveRequests();
  }, [filter]);
  
  const fetchLeaveRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const url = userRole === 'employee' 
        ? '/api/leave/my-requests'
        : '/api/leave/admin/all';
      
      const response = await axios.get(url, {
        params: { status: filter },
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setLeaveRequests(response.data.data.leaveRequests);
    } catch (error) {
      console.error('Error fetching leave requests:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleApprove = async (id, level = 'firstLevel') => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `/api/leave/${id}/approve`,
        { level, comments: 'Approved via dashboard' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchLeaveRequests();
    } catch (error) {
      console.error('Error approving leave:', error);
    }
  };
  
  const handleReject = async (id) => {
    const reason = prompt('Please provide rejection reason:');
    if (reason) {
      try {
        const token = localStorage.getItem('token');
        await axios.put(
          `/api/leave/${id}/reject`,
          { reason },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        fetchLeaveRequests();
      } catch (error) {
        console.error('Error rejecting leave:', error);
      }
    }
  };
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  if (loading) return <div className="text-center py-8">Loading leave requests...</div>;
  
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-xl font-semibold">Leave Requests</h2>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded-lg px-3 py-1"
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Request ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Employee</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Leave Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Duration</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Days</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Status</th>
              {(userRole === 'admin' || userRole === 'hr') && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Actions</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y">
            {leaveRequests.map((request) => (
              <tr key={request._id}>
                <td className="px-6 py-4 font-mono text-sm">{request.requestId}</td>
                <td className="px-6 py-4">
                  <div>
                    <div className="font-medium">{request.employeeName}</div>
                    <div className="text-sm text-gray-500">{request.employeeDepartment}</div>
                  </div>
                </td>
                <td className="px-6 py-4 capitalize">{request.leaveType}</td>
                <td className="px-6 py-4">
                  {new Date(request.startDate).toLocaleDateString()} - <br />
                  {new Date(request.endDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">{request.totalDays}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs ${getStatusColor(request.finalStatus)}`}>
                    {request.finalStatus.toUpperCase()}
                  </span>
                </td>
                {(userRole === 'admin' || userRole === 'hr') && request.finalStatus === 'pending' && (
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleApprove(request._id)}
                        className="text-green-600 hover:text-green-800"
                        title="Approve"
                      >
                        <CheckCircle className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleReject(request._id)}
                        className="text-red-600 hover:text-red-800"
                        title="Reject"
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {leaveRequests.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No leave requests found
        </div>
      )}
    </div>
  );
};

export default LeaveRequestList;