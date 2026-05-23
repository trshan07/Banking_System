import React, { useMemo, useState } from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaSearch,
  FaBuilding,
  FaUserTie,
  FaCheckCircle,
  FaUsers,
  FaTimesCircle,
} from "react-icons/fa";
import { toast } from "react-hot-toast";
import { formatCompactCurrency } from "../../utils/formatters";

const EMPTY_BRANCH_FORM = {
  code: "",
  name: "",
  address: "",
  city: "",
  state: "",
  country: "",
  phone: "",
  email: "",
  manager: "",
  status: "active",
  employees: 0,
  customers: 0,
  revenue: 0,
  established: "",
};

const BranchManagement = ({
  branches = [],
  loading = false,
  onCreateBranch,
  onUpdateBranch,
  onDeleteBranch,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [newBranch, setNewBranch] = useState(EMPTY_BRANCH_FORM);
  const [editBranch, setEditBranch] = useState(EMPTY_BRANCH_FORM);

  const branchStats = useMemo(() => ({
    total: branches.length,
    active: branches.filter((branch) => branch.status === "active").length,
    employees: branches.reduce((sum, branch) => sum + Number(branch.employees || 0), 0),
    customers: branches.reduce((sum, branch) => sum + Number(branch.customers || 0), 0),
  }), [branches]);

  const filteredBranches = useMemo(() => branches.filter((branch) =>
    (branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      branch.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      branch.city?.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filterStatus === "all" || branch.status === filterStatus)
  ), [branches, filterStatus, searchTerm]);

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700";
      case "maintenance":
        return "bg-yellow-100 text-yellow-700";
      case "closed":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const openEditModal = (branch) => {
    setSelectedBranch(branch);
    setEditBranch({
      code: branch.code || "",
      name: branch.name || "",
      address: branch.address || "",
      city: branch.city || "",
      state: branch.state || "",
      country: branch.country || "",
      phone: branch.phone || "",
      email: branch.email || "",
      manager: branch.manager || "",
      status: branch.status || "active",
      employees: branch.employees || 0,
      customers: branch.customers || 0,
      revenue: branch.revenue || 0,
      established: branch.established ? new Date(branch.established).toISOString().split("T")[0] : "",
    });
    setShowEditModal(true);
  };

  const handleAddBranch = async () => {
    if (!newBranch.code || !newBranch.name || !newBranch.address || !newBranch.phone) {
      toast.error("Please fill in the required branch fields");
      return;
    }

    if (!onCreateBranch) {
      return;
    }

    try {
      setSubmitting(true);
      await onCreateBranch(newBranch);
      setNewBranch(EMPTY_BRANCH_FORM);
      setShowAddModal(false);
    } catch (error) {
      // Parent handler already surfaces the backend error to the user.
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditBranch = async () => {
    if (!selectedBranch || !onUpdateBranch) {
      return;
    }

    if (!editBranch.code || !editBranch.name || !editBranch.address || !editBranch.phone) {
      toast.error("Please fill in the required branch fields");
      return;
    }

    try {
      setSubmitting(true);
      await onUpdateBranch(selectedBranch.id, editBranch);
      setShowEditModal(false);
      setSelectedBranch(null);
    } catch (error) {
      // Parent handler already surfaces the backend error to the user.
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteBranch = async (branchId) => {
    if (!onDeleteBranch) {
      return;
    }

    if (window.confirm("Are you sure you want to delete this branch?")) {
      try {
        await onDeleteBranch(branchId);
      } catch (error) {
        // Parent handler already surfaces the backend error to the user.
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-lg p-4">
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-slate-500">Total Branches</p><p className="text-2xl font-bold">{branchStats.total}</p></div>
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center"><FaBuilding className="text-purple-600" /></div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4">
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-slate-500">Active Branches</p><p className="text-2xl font-bold text-green-600">{branchStats.active}</p></div>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center"><FaCheckCircle className="text-green-600" /></div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4">
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-slate-500">Total Employees</p><p className="text-2xl font-bold">{branchStats.employees}</p></div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"><FaUserTie className="text-blue-600" /></div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4">
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-slate-500">Total Customers</p><p className="text-2xl font-bold">{branchStats.customers.toLocaleString()}</p></div>
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center"><FaUsers className="text-emerald-600" /></div>
          </div>
        </div>
      </div>

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

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {loading && (
              <div className="col-span-full text-center py-8 text-slate-500">Loading branch records...</div>
            )}
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
                    {branch.email || "N/A"}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-slate-500">Manager</p>
                      <p className="font-medium text-slate-800">{branch.manager || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Employees</p>
                      <p className="font-medium text-slate-800">{branch.employees}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Customers</p>
                      <p className="font-medium text-slate-800">{Number(branch.customers || 0).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Revenue</p>
                      <p className="font-medium text-green-600">{formatCompactCurrency(branch.revenue || 0)}</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-3 border-t">
                  <button
                    onClick={() => openEditModal(branch)}
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

          {!loading && filteredBranches.length === 0 && (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 text-center py-10 text-slate-500">
              No branches found matching your criteria.
            </div>
          )}
        </div>
      </div>

      {showAddModal && (
        <BranchModal
          title="Add New Branch"
          branch={newBranch}
          setBranch={setNewBranch}
          onCancel={() => setShowAddModal(false)}
          onSubmit={handleAddBranch}
          submitting={submitting}
          submitLabel="Add Branch"
        />
      )}

      {showEditModal && selectedBranch && (
        <BranchModal
          title="Edit Branch"
          branch={editBranch}
          setBranch={setEditBranch}
          onCancel={() => setShowEditModal(false)}
          onSubmit={handleEditBranch}
          submitting={submitting}
          submitLabel="Save Changes"
        />
      )}
    </div>
  );
};

const BranchModal = ({ title, branch, setBranch, onCancel, onSubmit, submitting, submitLabel }) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">{title}</h3>
          <button onClick={onCancel} className="p-2 hover:bg-slate-100 rounded-lg">
            <FaTimesCircle className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Branch Name *">
              <input type="text" value={branch.name} onChange={(e) => setBranch({ ...branch, name: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
            </Field>
            <Field label="Branch Code *">
              <input type="text" value={branch.code} onChange={(e) => setBranch({ ...branch, code: e.target.value.toUpperCase() })} className="w-full px-3 py-2 border rounded-lg" />
            </Field>
          </div>
          <Field label="Address *">
            <textarea rows="2" value={branch.address} onChange={(e) => setBranch({ ...branch, address: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
          </Field>
          <div className="grid md:grid-cols-3 gap-4">
            <Field label="City">
              <input type="text" value={branch.city} onChange={(e) => setBranch({ ...branch, city: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
            </Field>
            <Field label="State">
              <input type="text" value={branch.state} onChange={(e) => setBranch({ ...branch, state: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
            </Field>
            <Field label="Country">
              <input type="text" value={branch.country} onChange={(e) => setBranch({ ...branch, country: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
            </Field>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Phone *">
              <input type="tel" value={branch.phone} onChange={(e) => setBranch({ ...branch, phone: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
            </Field>
            <Field label="Email">
              <input type="email" value={branch.email} onChange={(e) => setBranch({ ...branch, email: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
            </Field>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Manager">
              <input type="text" value={branch.manager} onChange={(e) => setBranch({ ...branch, manager: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
            </Field>
            <Field label="Status">
              <select value={branch.status} onChange={(e) => setBranch({ ...branch, status: e.target.value })} className="w-full px-3 py-2 border rounded-lg">
                <option value="active">active</option>
                <option value="maintenance">maintenance</option>
                <option value="closed">closed</option>
              </select>
            </Field>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <Field label="Employees">
              <input type="number" value={branch.employees} onChange={(e) => setBranch({ ...branch, employees: Number(e.target.value) })} className="w-full px-3 py-2 border rounded-lg" />
            </Field>
            <Field label="Customers">
              <input type="number" value={branch.customers} onChange={(e) => setBranch({ ...branch, customers: Number(e.target.value) })} className="w-full px-3 py-2 border rounded-lg" />
            </Field>
            <Field label="Revenue (LKR)">
              <input type="number" value={branch.revenue} onChange={(e) => setBranch({ ...branch, revenue: Number(e.target.value) })} className="w-full px-3 py-2 border rounded-lg" />
            </Field>
          </div>
          <Field label="Established Date">
            <input type="date" value={branch.established} onChange={(e) => setBranch({ ...branch, established: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
          </Field>
        </div>
        <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
          <button onClick={onCancel} className="px-4 py-2 border rounded-lg hover:bg-slate-50">Cancel</button>
          <button onClick={onSubmit} disabled={submitting} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-60">
            {submitting ? "Saving..." : submitLabel}
          </button>
        </div>
      </div>
    </div>
  </div>
);

const Field = ({ label, children }) => (
  <div>
    <label className="block text-sm font-medium mb-1">{label}</label>
    {children}
  </div>
);

export default BranchManagement;
