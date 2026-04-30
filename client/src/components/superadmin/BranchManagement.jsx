import React, { useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaMapMarkerAlt, FaPhone, FaEnvelope, FaSearch, FaFilter, FaBuilding, FaUserTie, FaClock, FaChartLine, FaCheckCircle, FaUsers } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { formatCompactCurrency } from "../../utils/formatters";

const BranchManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(null);
  
  const [branches, setBranches] = useState([
    { 
      id: 1, 
      name: "New York Headquarters", 
      code: "NYC001", 
      address: "123 Wall Street, Manhattan, NY 10001", 
      phone: "+1 (212) 555-0100", 
      email: "nyc@smartbank.com", 
      manager: "John Smith", 
      status: "active",
      employees: 45,
      customers: 12500,
      revenue: 4500000,
      established: "2010-01-15"
    },
    { 
      id: 2, 
      name: "Los Angeles Branch", 
      code: "LA002", 
      address: "456 Sunset Boulevard, Los Angeles, CA 90210", 
      phone: "+1 (310) 555-0200", 
      email: "la@smartbank.com", 
      manager: "Jane Doe", 
      status: "active",
      employees: 32,
      customers: 8900,
      revenue: 3200000,
      established: "2012-03-20"
    },
    { 
      id: 3, 
      name: "Chicago Branch", 
      code: "CHI003", 
      address: "789 Michigan Avenue, Chicago, IL 60601", 
      phone: "+1 (312) 555-0300", 
      email: "chicago@smartbank.com", 
      manager: "Bob Johnson", 
      status: "active",
      employees: 28,
      customers: 7600,
      revenue: 2800000,
      established: "2014-06-10"
    },
    { 
      id: 4, 
      name: "Miami Branch", 
      code: "MIA004", 
      address: "321 Ocean Drive, Miami, FL 33139", 
      phone: "+1 (305) 555-0400", 
      email: "miami@smartbank.com", 
      manager: "Alice Brown", 
      status: "maintenance",
      employees: 22,
      customers: 5400,
      revenue: 2100000,
      established: "2016-09-05"
    },
    { 
      id: 5, 
      name: "Dallas Branch", 
      code: "DAL005", 
      address: "654 Main Street, Dallas, TX 75201", 
      phone: "+1 (214) 555-0500", 
      email: "dallas@smartbank.com", 
      manager: "Charlie Wilson", 
      status: "active",
      employees: 25,
      customers: 6200,
      revenue: 2400000,
      established: "2018-01-30"
    },
  ]);

  const handleAddBranch = () => {
    toast.success("Branch added successfully");
    setShowAddModal(false);
  };

  const handleEditBranch = () => {
    toast.success("Branch updated successfully");
    setShowEditModal(false);
  };

  const handleDeleteBranch = (id) => {
    if (window.confirm("Are you sure you want to delete this branch?")) {
      toast.success("Branch deleted successfully");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-700";
      case "maintenance": return "bg-yellow-100 text-yellow-700";
      case "closed": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const filteredBranches = branches.filter(branch => 
    (branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     branch.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
     branch.city?.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filterStatus === "all" || branch.status === filterStatus)
  );

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-lg p-4">
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-slate-500">Total Branches</p><p className="text-2xl font-bold">{branches.length}</p></div>
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center"><FaBuilding className="text-purple-600" /></div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4">
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-slate-500">Active Branches</p><p className="text-2xl font-bold text-green-600">{branches.filter(b => b.status === "active").length}</p></div>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center"><FaCheckCircle className="text-green-600" /></div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4">
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-slate-500">Total Employees</p><p className="text-2xl font-bold">{branches.reduce((sum, b) => sum + b.employees, 0)}</p></div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"><FaUserTie className="text-blue-600" /></div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4">
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-slate-500">Total Customers</p><p className="text-2xl font-bold">{branches.reduce((sum, b) => sum + b.customers, 0).toLocaleString()}</p></div>
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center"><FaUsers className="text-emerald-600" /></div>
          </div>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-xl shadow-lg">
        <div className="p-6 border-b flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold">Branch Management</h3>
            <p className="text-sm text-slate-500 mt-1">Manage all bank branches and their operations</p>
          </div>
          <button onClick={() => setShowAddModal(true)} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center">
            <FaPlus className="mr-2" /> Add Branch
          </button>
        </div>
        
        <div className="p-6">
          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex-1 min-w-[200px] relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search by name, code, or city..." 
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
              <option value="maintenance">Maintenance</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          {/* Branches Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredBranches.map((branch) => (
              <div key={branch.id} className="border rounded-xl p-5 hover:shadow-lg transition-all hover:border-purple-200">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold text-lg text-slate-800">{branch.name}</h4>
                    <p className="text-sm text-purple-600 font-mono">Code: {branch.code}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(branch.status)}`}>
                    {branch.status}
                  </span>
                </div>
                
                <div className="space-y-2 mb-4">
                  <p className="text-sm text-slate-600 flex items-start">
                    <FaMapMarkerAlt className="mr-2 mt-0.5 flex-shrink-0 text-slate-400" /> 
                    <span>{branch.address}</span>
                  </p>
                  <p className="text-sm text-slate-600 flex items-center">
                    <FaPhone className="mr-2 text-slate-400" /> 
                    {branch.phone}
                  </p>
                  <p className="text-sm text-slate-600 flex items-center">
                    <FaEnvelope className="mr-2 text-slate-400" /> 
                    {branch.email}
                  </p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-slate-500">Manager</p>
                      <p className="font-medium text-slate-800">{branch.manager}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Employees</p>
                      <p className="font-medium text-slate-800">{branch.employees}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Customers</p>
                      <p className="font-medium text-slate-800">{branch.customers.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Revenue</p>
                      <p className="font-medium text-green-600">{formatCompactCurrency(branch.revenue)}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2 pt-3 border-t">
                  <button 
                    onClick={() => {
                      setSelectedBranch(branch);
                      setShowEditModal(true);
                    }}
                    className="px-3 py-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center"
                  >
                    <FaEdit className="mr-1" /> Edit
                  </button>
                  <button 
                    onClick={() => handleDeleteBranch(branch.id)}
                    className="px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center"
                  >
                    <FaTrash className="mr-1" /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredBranches.length === 0 && (
            <div className="text-center py-8 text-slate-500">
              No branches found matching your criteria
            </div>
          )}
        </div>
      </div>

      {/* Add Branch Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Add New Branch</h3>
                <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                  <FaTimesCircle className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Branch Name *</label>
                    <input type="text" className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Enter branch name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Branch Code *</label>
                    <input type="text" className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Enter branch code" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Address *</label>
                  <textarea rows="2" className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Enter full address"></textarea>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Phone *</label>
                    <input type="tel" className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Enter phone number" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email *</label>
                    <input type="email" className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Enter email address" />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Branch Manager</label>
                    <input type="text" className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Enter manager name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Status</label>
                    <select className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                      <option>active</option>
                      <option>maintenance</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
                <button onClick={() => setShowAddModal(false)} className="px-4 py-2 border rounded-lg hover:bg-slate-50">Cancel</button>
                <button onClick={handleAddBranch} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">Add Branch</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Branch Modal */}
      {showEditModal && selectedBranch && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Edit Branch</h3>
                <button onClick={() => setShowEditModal(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                  <FaTimesCircle className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Branch Name</label>
                    <input type="text" defaultValue={selectedBranch.name} className="w-full px-3 py-2 border rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Branch Code</label>
                    <input type="text" defaultValue={selectedBranch.code} className="w-full px-3 py-2 border rounded-lg" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Address</label>
                  <textarea rows="2" defaultValue={selectedBranch.address} className="w-full px-3 py-2 border rounded-lg"></textarea>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Phone</label>
                    <input type="tel" defaultValue={selectedBranch.phone} className="w-full px-3 py-2 border rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input type="email" defaultValue={selectedBranch.email} className="w-full px-3 py-2 border rounded-lg" />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Manager</label>
                    <input type="text" defaultValue={selectedBranch.manager} className="w-full px-3 py-2 border rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Status</label>
                    <select defaultValue={selectedBranch.status} className="w-full px-3 py-2 border rounded-lg">
                      <option>active</option>
                      <option>maintenance</option>
                      <option>closed</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
                <button onClick={() => setShowEditModal(false)} className="px-4 py-2 border rounded-lg hover:bg-slate-50">Cancel</button>
                <button onClick={handleEditBranch} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">Save Changes</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BranchManagement;
