import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { FaPlus, FaEdit, FaTrash, FaUserPlus, FaUsers, FaShieldAlt, FaCrown } from 'react-icons/fa';
import toast from 'react-hot-toast';

const AdminManagement = () => {
  const { user } = useAuth();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    role: 'admin'
  });

  // Fetch admins
  const fetchAdmins = async () => {
    try {
      const response = await fetch('/api/users?role=admin', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAdmins(data.data.users.filter(u => u.role === 'admin'));
      }
    } catch (error) {
      console.error('Failed to fetch admins:', error);
      toast.error('Failed to load admins');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Admin created successfully!');
        setShowCreateModal(false);
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          phone: '',
          address: '',
          role: 'admin'
        });
        fetchAdmins();
      } else {
        toast.error(data.message || 'Failed to create admin');
      }
    } catch (error) {
      console.error('Create admin error:', error);
      toast.error('Failed to create admin');
    } finally {
      setLoading(false);
    }
  };

  // Handle delete admin
  const handleDeleteAdmin = async (adminId) => {
    if (!window.confirm('Are you sure you want to deactivate this admin?')) return;

    try {
      const response = await fetch(`/api/users/${adminId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        toast.success('Admin deactivated successfully');
        fetchAdmins();
      } else {
        toast.error('Failed to deactivate admin');
      }
    } catch (error) {
      console.error('Delete admin error:', error);
      toast.error('Failed to deactivate admin');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <FaCrown className="mr-3 text-yellow-500" />
              Admin Management
            </h1>
            <p className="text-gray-600 mt-2">Manage system administrators</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
          >
            <FaUserPlus className="mr-2" />
            Create Admin
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <FaUsers className="text-blue-500 text-2xl mr-3" />
              <div>
                <p className="text-sm text-gray-600">Total Admins</p>
                <p className="text-2xl font-bold text-gray-900">{admins.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <FaShieldAlt className="text-green-500 text-2xl mr-3" />
              <div>
                <p className="text-sm text-gray-600">Active Admins</p>
                <p className="text-2xl font-bold text-gray-900">
                  {admins.filter(admin => admin.status === 'active').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <FaCrown className="text-purple-500 text-2xl mr-3" />
              <div>
                <p className="text-sm text-gray-600">Your Role</p>
                <p className="text-2xl font-bold text-gray-900 capitalize">{user?.role}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Admins List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">System Administrators</h2>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-4">Loading admins...</p>
            </div>
          ) : admins.length === 0 ? (
            <div className="p-8 text-center">
              <FaUsers className="text-gray-400 text-4xl mx-auto mb-4" />
              <p className="text-gray-600">No admins found</p>
              <p className="text-sm text-gray-500 mt-2">Create your first admin to get started</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {admins.map((admin) => (
                    <tr key={admin._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                              <span className="text-white font-medium">
                                {admin.firstName[0]}{admin.lastName[0]}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {admin.firstName} {admin.lastName}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {admin.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          admin.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {admin.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(admin.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleDeleteAdmin(admin._id)}
                          className="text-red-600 hover:text-red-900 ml-4"
                          disabled={admin._id === user?.id}
                        >
                          <FaTrash className="inline mr-1" />
                          Deactivate
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Create Admin Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Create New Admin</h3>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">First Name</label>
                      <input
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Last Name</label>
                      <input
                        type="text"
                        required
                        value={formData.lastName}
                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Password</label>
                    <input
                      type="password"
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Address</label>
                    <textarea
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      rows={3}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    />
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowCreateModal(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                      {loading ? 'Creating...' : 'Create Admin'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminManagement;