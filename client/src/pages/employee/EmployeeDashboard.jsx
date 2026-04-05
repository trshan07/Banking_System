import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, CheckCircle, Clock, AlertCircle, Search, Filter } from 'lucide-react';

const EmployeeDashboard = () => {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    pendingKYC: 0,
    openTickets: 0,
    flaggedFrauds: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const [statsRes, activitiesRes, customersRes] = await Promise.all([
        axios.get('/api/employee/stats', config),
        axios.get('/api/employee/activities', config),
        axios.get('/api/employee/customers', config)
      ]);
      
      setStats(statsRes.data.data || {});
      setRecentActivities(activitiesRes.data.data || []);
      setCustomers(customersRes.data.data?.customers || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleKYCApprove = async (customerId) => {
    try {
      await axios.put(`/api/employee/kyc/${customerId}/approve`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchDashboardData(); // Refresh
    } catch (error) {
      alert('Approval failed', error.response?.data?.message || error.message );
    }
  };

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  if (loading) return <div className="flex justify-center items-center h-screen">Loading Dashboard...</div>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Employee Dashboard</h1>
      
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Customers" value={stats.totalCustomers} icon={Users} color="bg-blue-500" />
        <StatCard title="Pending KYC" value={stats.pendingKYC} icon={Clock} color="bg-yellow-500" />
        <StatCard title="Open Support Tickets" value={stats.openTickets} icon={AlertCircle} color="bg-red-500" />
        <StatCard title="Fraud Alerts" value={stats.flaggedFrauds} icon={CheckCircle} color="bg-green-500" />
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">Recent Activities</h2>
        </div>
        <div className="divide-y">
          {recentActivities.map((activity, idx) => (
            <div key={idx} className="p-4 flex items-center justify-between">
              <div>
                <p className="font-medium">{activity.description || 'N/A'}</p>
                <p className="text-sm text-gray-500">{activity.time || 'N/A'}</p>
              </div>
              <span className={`px-2 py-1 rounded text-xs ${
                activity.type === 'kyc' ? 'bg-yellow-100 text-yellow-800' :
                activity.type === 'fraud' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
              }`}>
                {(activity.type || 'UNKNOWN').toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Customer Management Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">Customer Management</h2>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search customers..."
                className="pl-9 pr-4 py-2 border rounded-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="p-2 border rounded-lg"><Filter className="w-5 h-5" /></button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">KYC Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {customers.filter(c => (c.name || '').toLowerCase().includes(searchTerm.toLowerCase())).map((customer) => (
                <tr key={customer._id}>
                  <td className="px-6 py-4">{customer.name || 'N/A'}</td>
                  <td className="px-6 py-4">{customer.email || 'N/A'}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs ${
                      customer.kycStatus === 'approved' ? 'bg-green-100 text-green-800' :
                      customer.kycStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100'
                    }`}>
                      {customer.kycStatus || 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {customer.kycStatus === 'pending' && (
                      <button
                        onClick={() => handleKYCApprove(customer._id)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Approve KYC
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;