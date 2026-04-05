import React, { useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaBan, FaCheckCircle, FaSearch, FaFilter, FaEnvelope, FaPhone, FaUserShield, FaBuilding } from "react-icons/fa";
import { toast } from "react-hot-toast";

const AdminManagement = ({ admins }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [newAdmin, setNewAdmin] = useState({
    name: "",
    email: "",
    role: "admin",
    department: "",
    phone: "",
    status: "active"
  });

  const defaultAdmins = admins || [
    { id: 1, name: "John Admin", email: "john@smartbank.com", role: "Admin", department: "IT", status: "active", lastActive: "2024-01-15", phone: "+1 (555) 123-4567", permissions: ["users", "transactions", "reports"] },
    { id: 2, name: "Jane Smith", email: "jane@smartbank.com", role: "Supervisor", department: "Operations", status: "active", lastActive: "2024-01-14", phone: "+1 (555) 987-6543", permissions: ["users", "transactions"] },
    { id: 3, name: "Bob Wilson", email: "bob@smartbank.com", role: "Auditor", department: "Compliance", status: "inactive", lastActive: "2024-01-10", phone: "+1 (555) 456-7890", permissions: ["reports", "audit"] },
    { id: 4, name: "Alice Brown", email: "alice@smartbank.com", role: "Admin", department: "Customer Service", status: "active", lastActive: "2024-01-13", phone: "+1 (555) 234-5678", permissions: ["users", "transactions", "support"] },
  ];

  const handleAddAdmin = () => {
    if (!newAdmin.name || !newAdmin.email) {
      toast.error("Please fill in all required fields");
      return;
    }
    toast.success("Admin added successfully");
    setShowAddModal(false);
    setNewAdmin({ name: "", email: "", role: "admin", department: "", phone: "", status: "active" });
  };

  const handleEditAdmin = () => {
    toast.success("Admin updated successfully");
    setShowEditModal(false);
  };

  const handleDeleteAdmin = (id) => {
    if (window.confirm("Are you sure you want to delete this admin?")) {
      toast.success("Admin deleted successfully");
    }
  };

  const handleToggleStatus = (id) => {
    toast.success("Admin status updated");
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "Admin": return "bg-purple-100 text-purple-700";
      case "Supervisor": return "bg-blue-100 text-blue-700";
      case "Auditor": return "bg-green-100 text-green-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const filteredAdmins = defaultAdmins.filter(admin => 
    (admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     admin.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filterRole === "all" || admin.role === filterRole) &&
    (filterStatus === "all" || admin.status === filterStatus)
  );

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-lg p-4">
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-slate-500">Total Admins</p><p className="text-2xl font-bold">{defaultAdmins.length}</p></div>
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center"><FaUserShield className="text-purple-600" /></div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4">
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-slate-500">Active Admins</p><p className="text-2xl font-bold text-green-600">{defaultAdmins.filter(a => a.status === "active").length}</p></div>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center"><FaCheckCircle className="text-green-600" /></div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4">
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-slate-500">Roles</p><p className="text-2xl font-bold">{new Set(defaultAdmins.map(a => a.role)).size}</p></div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"><FaUserShield className="text-blue-600" /></div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4">
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-slate-500">Departments</p><p className="text-2xl font-bold">{new Set(defaultAdmins.map(a => a.department)).size}</p></div>
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center"><FaBuilding className="text-emerald-600" /></div>
          </div>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-xl shadow-lg">
        <div className="p-6 border-b flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold">Admin Management</h3>
            <p className="text-sm text-slate-500 mt-1">Manage system administrators and their permissions</p>
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
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Roles</option>
              <option value="Admin">Admin</option>
              <option value="Supervisor">Supervisor</option>
              <option value="Auditor">Auditor</option>
            </select>
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Admins Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Active</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredAdmins.map((admin) => (
                  <tr key={admin.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-slate-800">{admin.name}</p>
                        <p className="text-xs text-slate-500">{admin.phone}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{admin.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(admin.role)}`}>
                        {admin.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{admin.department}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${admin.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {admin.status}
                      </span>
                    </td>
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
                          onClick={() => handleToggleStatus(admin.id)}
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
                <div>
                  <label className="block text-sm font-medium mb-1">Full Name *</label>
                  <input 
                    type="text" 
                    value={newAdmin.name}
                    onChange={(e) => setNewAdmin({...newAdmin, name: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" 
                    placeholder="Enter full name"
                  />
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
                  <label className="block text-sm font-medium mb-1">Role</label>
                  <select 
                    value={newAdmin.role}
                    onChange={(e) => setNewAdmin({...newAdmin, role: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="admin">Admin</option>
                    <option value="supervisor">Supervisor</option>
                    <option value="auditor">Auditor</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Department</label>
                  <input 
                    type="text" 
                    value={newAdmin.department}
                    onChange={(e) => setNewAdmin({...newAdmin, department: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" 
                    placeholder="Enter department"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <input 
                    type="tel" 
                    value={newAdmin.phone}
                    onChange={(e) => setNewAdmin({...newAdmin, phone: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" 
                    placeholder="Enter phone number"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
                <button onClick={() => setShowAddModal(false)} className="px-4 py-2 border rounded-lg hover:bg-slate-50 transition-colors">Cancel</button>
                <button onClick={handleAddAdmin} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">Add Admin</button>
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
                <div>
                  <label className="block text-sm font-medium mb-1">Full Name</label>
                  <input 
                    type="text" 
                    defaultValue={selectedAdmin.name}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input 
                    type="email" 
                    defaultValue={selectedAdmin.email}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Role</label>
                  <select className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                    <option selected={selectedAdmin.role === "Admin"}>Admin</option>
                    <option selected={selectedAdmin.role === "Supervisor"}>Supervisor</option>
                    <option selected={selectedAdmin.role === "Auditor"}>Auditor</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Department</label>
                  <input 
                    type="text" 
                    defaultValue={selectedAdmin.department}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" 
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
                <button onClick={() => setShowEditModal(false)} className="px-4 py-2 border rounded-lg hover:bg-slate-50">Cancel</button>
                <button onClick={handleEditAdmin} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">Save Changes</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminManagement;