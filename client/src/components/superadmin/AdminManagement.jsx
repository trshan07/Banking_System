import React, { useEffect, useState } from "react";
import {
  FaBan,
  FaCheckCircle,
  FaEdit,
  FaPhone,
  FaPlus,
  FaSearch,
  FaTimesCircle,
  FaTrash,
  FaUserShield,
} from "react-icons/fa";
import { toast } from "react-hot-toast";

const EMPTY_ADMIN_FORM = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  phone: "",
  address: "",
  role: "admin",
  status: "active",
};

const AdminManagement = ({
  admins = [],
  summary,
  loading = false,
  onCreateAdmin,
  onUpdateAdmin,
  onToggleAdminStatus,
  onDeleteAdmin,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [newAdmin, setNewAdmin] = useState(EMPTY_ADMIN_FORM);
  const [editAdmin, setEditAdmin] = useState(EMPTY_ADMIN_FORM);

  useEffect(() => {
    if (!selectedAdmin) {
      return;
    }

    setEditAdmin({
      firstName: selectedAdmin.firstName || "",
      lastName: selectedAdmin.lastName || "",
      email: selectedAdmin.email || "",
      phone: selectedAdmin.phone || "",
      address: selectedAdmin.address || "",
      role: selectedAdmin.role || "admin",
      status: selectedAdmin.status || "active",
      password: "",
    });
  }, [selectedAdmin]);

  const adminSummary = summary || {
    total: admins.length,
    active: admins.filter((admin) => admin.status === "active").length,
    pending: admins.filter((admin) => admin.status === "pending").length,
    inactive: admins.filter((admin) => admin.status === "inactive").length,
    suspended: admins.filter((admin) => admin.status === "suspended").length,
  };

  const resetAddForm = () => {
    setNewAdmin(EMPTY_ADMIN_FORM);
    setShowAddModal(false);
  };

  const handleAddAdmin = async () => {
    if (!newAdmin.firstName || !newAdmin.lastName || !newAdmin.email || !newAdmin.password || !newAdmin.phone || !newAdmin.address) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!onCreateAdmin) {
      return;
    }

    try {
      setSubmitting(true);
      await onCreateAdmin(newAdmin);
      resetAddForm();
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditAdmin = async () => {
    if (!selectedAdmin || !onUpdateAdmin) {
      return;
    }

    if (!editAdmin.firstName || !editAdmin.lastName || !editAdmin.email || !editAdmin.phone || !editAdmin.address) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setSubmitting(true);
      await onUpdateAdmin(selectedAdmin.id, {
        firstName: editAdmin.firstName,
        lastName: editAdmin.lastName,
        email: editAdmin.email,
        phone: editAdmin.phone,
        address: editAdmin.address,
        status: editAdmin.status,
      });
      setShowEditModal(false);
      setSelectedAdmin(null);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteAdmin = async (id) => {
    if (!onDeleteAdmin) {
      return;
    }

    if (window.confirm("Are you sure you want to delete this admin?")) {
      await onDeleteAdmin(id);
    }
  };

  const handleToggleStatus = async (admin) => {
    if (!onToggleAdminStatus) {
      return;
    }

    await onToggleAdminStatus(admin);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-amber-100 text-amber-700";
      case "suspended":
        return "bg-red-100 text-red-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const filteredAdmins = admins.filter((admin) =>
    (`${admin.firstName || ""} ${admin.lastName || ""}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filterStatus === "all" || admin.status === filterStatus)
  );

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-lg p-4">
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-slate-500">Total Admins</p><p className="text-2xl font-bold">{adminSummary.total}</p></div>
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center"><FaUserShield className="text-purple-600" /></div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4">
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-slate-500">Active Admins</p><p className="text-2xl font-bold text-green-600">{adminSummary.active || 0}</p></div>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center"><FaCheckCircle className="text-green-600" /></div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4">
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-slate-500">Pending Admins</p><p className="text-2xl font-bold text-amber-600">{adminSummary.pending || 0}</p></div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"><FaUserShield className="text-blue-600" /></div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4">
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-slate-500">Inactive/Suspended</p><p className="text-2xl font-bold text-red-600">{(adminSummary.inactive || 0) + (adminSummary.suspended || 0)}</p></div>
            <div className="w-10 h-10 bg-rose-100 rounded-lg flex items-center justify-center"><FaBan className="text-rose-600" /></div>
          </div>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-xl shadow-lg">
        <div className="p-6 border-b flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold">Admin Management</h3>
            <p className="text-sm text-slate-500 mt-1">Create, update, activate, and deactivate administrator accounts</p>
          </div>
          <button onClick={() => setShowAddModal(true)} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center">
            <FaPlus className="mr-2" /> Add Admin
          </button>
        </div>
        
        <div className="p-6">
          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex-1 min-w-[200px] relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search by name or email..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" 
              />
            </div>
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>

          {/* Admins Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Active</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {loading && (
                  <tr>
                    <td colSpan="7" className="px-6 py-10 text-center text-slate-500">Loading admin records...</td>
                  </tr>
                )}
                {filteredAdmins.map((admin) => (
                  <tr key={admin.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-slate-800">{admin.name}</p>
                        <p className="text-xs text-slate-500 uppercase">{admin.role}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{admin.email}</td>
                    <td className="px-6 py-4 text-slate-600">{admin.phone || "N/A"}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(admin.status)}`}>
                        {admin.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">{admin.createdAt ? new Date(admin.createdAt).toISOString().split("T")[0] : "N/A"}</td>
                    <td className="px-6 py-4 text-sm text-slate-500">{admin.lastActive}</td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => {
                            setSelectedAdmin(admin);
                            setShowEditModal(true);
                          }}
                          className="p-1 text-blue-600 hover:text-blue-700 transition-colors"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button 
                          onClick={() => handleToggleStatus(admin)}
                          className={`p-1 ${admin.status === 'active' ? 'text-red-600 hover:text-red-700' : 'text-green-600 hover:text-green-700'} transition-colors`}
                          title={admin.status === 'active' ? 'Deactivate' : 'Activate'}
                        >
                          {admin.status === 'active' ? <FaBan /> : <FaCheckCircle />}
                        </button>
                        <button 
                          onClick={() => handleDeleteAdmin(admin.id)}
                          className="p-1 text-red-600 hover:text-red-700 transition-colors"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredAdmins.length === 0 && (
            <div className="text-center py-8 text-slate-500">
              No admins found matching your criteria
            </div>
          )}
        </div>
      </div>

      {/* Add Admin Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Add New Admin</h3>
                <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                  <FaTimesCircle className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">First Name *</label>
                    <input 
                      type="text" 
                      value={newAdmin.firstName}
                      onChange={(e) => setNewAdmin({...newAdmin, firstName: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" 
                      placeholder="First name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Last Name *</label>
                    <input 
                      type="text" 
                      value={newAdmin.lastName}
                      onChange={(e) => setNewAdmin({...newAdmin, lastName: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" 
                      placeholder="Last name"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email *</label>
                  <input 
                    type="email" 
                    value={newAdmin.email}
                    onChange={(e) => setNewAdmin({...newAdmin, email: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" 
                    placeholder="Enter email address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Password *</label>
                  <input 
                    type="password" 
                    value={newAdmin.password}
                    onChange={(e) => setNewAdmin({...newAdmin, password: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" 
                    placeholder="Temporary password"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone *</label>
                  <input 
                    type="tel" 
                    value={newAdmin.phone}
                    onChange={(e) => setNewAdmin({...newAdmin, phone: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" 
                    placeholder="Enter phone number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Address *</label>
                  <textarea
                    value={newAdmin.address}
                    onChange={(e) => setNewAdmin({...newAdmin, address: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    rows="3"
                    placeholder="Enter address"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
                <button onClick={() => setShowAddModal(false)} className="px-4 py-2 border rounded-lg hover:bg-slate-50 transition-colors">Cancel</button>
                <button onClick={handleAddAdmin} disabled={submitting} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-60">{submitting ? "Saving..." : "Add Admin"}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Admin Modal */}
      {showEditModal && selectedAdmin && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Edit Admin</h3>
                <button onClick={() => setShowEditModal(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                  <FaTimesCircle className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">First Name</label>
                    <input 
                      type="text" 
                      value={editAdmin.firstName}
                      onChange={(e) => setEditAdmin({...editAdmin, firstName: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Last Name</label>
                    <input 
                      type="text" 
                      value={editAdmin.lastName}
                      onChange={(e) => setEditAdmin({...editAdmin, lastName: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input 
                    type="email" 
                    value={editAdmin.email}
                    onChange={(e) => setEditAdmin({...editAdmin, email: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <input 
                    type="tel" 
                    value={editAdmin.phone}
                    onChange={(e) => setEditAdmin({...editAdmin, phone: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Address</label>
                  <textarea
                    value={editAdmin.address}
                    onChange={(e) => setEditAdmin({...editAdmin, address: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    rows="3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <select value={editAdmin.status} onChange={(e) => setEditAdmin({...editAdmin, status: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
                <button onClick={() => setShowEditModal(false)} className="px-4 py-2 border rounded-lg hover:bg-slate-50">Cancel</button>
                <button onClick={handleEditAdmin} disabled={submitting} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-60">{submitting ? "Saving..." : "Save Changes"}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminManagement;