import React, { useState, useEffect } from "react";
import {
  FaSearch,
  FaFilter,
  FaEye,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaUserCheck,
  FaIdCard,
  FaFileAlt,
  FaDownload,
  FaUpload,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaFlag,
  FaBriefcase,
} from "react-icons/fa";
import { toast } from "react-hot-toast";
import axios from "axios";

const KYCModule = () => {
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });

  useEffect(() => {
    fetchApplications();
    fetchStats();
  }, [filterStatus, currentPage]);

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/api/admin/kyc/applications", {
        params: { status: filterStatus, page: currentPage },
        headers: { Authorization: `Bearer ${token}` },
      });
      setApplications(response.data.data);
    } catch (error) {
      console.error("Error fetching KYC applications:", error);
      setApplications([
        {
          id: "KYC-2024-001",
          userId: "USR-001",
          name: "John Doe",
          email: "john@example.com",
          phone: "+1 (555) 123-4567",
          status: "pending",
          submittedDate: "2024-01-15",
          documentType: "Passport",
          documentNumber: "P12345678",
          riskLevel: "low",
          address: "123 Main St, New York, NY 10001",
          dateOfBirth: "1985-06-15",
          nationality: "American",
          occupation: "Software Engineer",
          documents: [
            { type: "ID Front", url: "#", status: "uploaded" },
            { type: "ID Back", url: "#", status: "uploaded" },
            { type: "Address Proof", url: "#", status: "uploaded" },
          ],
        },
        {
          id: "KYC-2024-002",
          userId: "USR-002",
          name: "Jane Smith",
          email: "jane@example.com",
          phone: "+1 (555) 987-6543",
          status: "pending",
          submittedDate: "2024-01-14",
          documentType: "Driver License",
          documentNumber: "DL98765432",
          riskLevel: "medium",
          address: "456 Oak Ave, Los Angeles, CA 90210",
          dateOfBirth: "1990-03-22",
          nationality: "American",
          occupation: "Marketing Manager",
          documents: [
            { type: "ID Front", url: "#", status: "uploaded" },
            { type: "ID Back", url: "#", status: "uploaded" },
            { type: "Address Proof", url: "#", status: "missing" },
          ],
        },
        {
          id: "KYC-2024-003",
          userId: "USR-003",
          name: "Bob Johnson",
          email: "bob@example.com",
          phone: "+1 (555) 456-7890",
          status: "approved",
          submittedDate: "2024-01-10",
          approvedDate: "2024-01-12",
          documentType: "National ID",
          documentNumber: "NID123456",
          riskLevel: "low",
          address: "789 Pine Rd, Chicago, IL 60601",
          dateOfBirth: "1978-11-30",
          nationality: "American",
          occupation: "Business Owner",
          documents: [
            { type: "ID Front", url: "#", status: "verified" },
            { type: "ID Back", url: "#", status: "verified" },
            { type: "Address Proof", url: "#", status: "verified" },
          ],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/api/admin/kyc/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(response.data.data);
    } catch (error) {
      setStats({ total: 156, pending: 34, approved: 112, rejected: 10 });
    }
  };

  const handleApprove = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`/api/admin/kyc/${id}/approve`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("KYC application approved");
      fetchApplications();
      fetchStats();
    } catch (error) {
      toast.error("Failed to approve application");
    }
  };

  const handleReject = async (id) => {
    const reason = prompt("Please provide rejection reason:");
    if (reason) {
      try {
        const token = localStorage.getItem("token");
        await axios.put(`/api/admin/kyc/${id}/reject`, { reason }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("KYC application rejected");
        fetchApplications();
        fetchStats();
      } catch (error) {
        toast.error("Failed to reject application");
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved": return "bg-green-100 text-green-700";
      case "pending": return "bg-yellow-100 text-yellow-700";
      case "rejected": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case "low": return "bg-green-100 text-green-700";
      case "medium": return "bg-yellow-100 text-yellow-700";
      case "high": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading KYC applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-lg p-4">
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-slate-500">Total Applications</p><p className="text-2xl font-bold">{stats.total}</p></div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"><FaIdCard className="text-blue-600" /></div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4">
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-slate-500">Pending</p><p className="text-2xl font-bold text-yellow-600">{stats.pending}</p></div>
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center"><FaClock className="text-yellow-600" /></div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4">
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-slate-500">Approved</p><p className="text-2xl font-bold text-green-600">{stats.approved}</p></div>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center"><FaCheckCircle className="text-green-600" /></div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4">
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-slate-500">Rejected</p><p className="text-2xl font-bold text-red-600">{stats.rejected}</p></div>
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center"><FaTimesCircle className="text-red-600" /></div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-4">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, email, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border rounded-lg"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center">
            <FaDownload className="mr-2" /> Export
          </button>
        </div>
      </div>

      {/* Applications Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {applications
          .filter(app => app.name.toLowerCase().includes(searchTerm.toLowerCase()) || app.email.toLowerCase().includes(searchTerm.toLowerCase()))
          .map((application) => (
            <div key={application.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                    <FaUserCheck className="text-emerald-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{application.name}</h3>
                    <p className="text-sm text-slate-500">{application.email}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(application.status)}`}>
                    {application.status}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs ${getRiskColor(application.riskLevel)}`}>
                    {application.riskLevel} risk
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                <div className="flex items-center text-slate-600"><FaPhone className="mr-2 w-3 h-3" /> {application.phone}</div>
                <div className="flex items-center text-slate-600"><FaCalendarAlt className="mr-2 w-3 h-3" /> Submitted: {application.submittedDate}</div>
                <div className="flex items-center text-slate-600"><FaIdCard className="mr-2 w-3 h-3" /> {application.documentType}</div>
                <div className="flex items-center text-slate-600"><FaFlag className="mr-2 w-3 h-3" /> {application.nationality}</div>
              </div>

              <div className="mb-4">
                <p className="text-sm font-medium mb-2">Documents:</p>
                <div className="space-y-1">
                  {application.documents.map((doc, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm">
                      <span>{doc.type}</span>
                      <span className={doc.status === "verified" ? "text-green-600" : doc.status === "uploaded" ? "text-blue-600" : "text-red-600"}>
                        {doc.status === "verified" ? <FaCheckCircle /> : doc.status === "uploaded" ? <FaUpload /> : <FaTimesCircle />}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setSelectedApplication(application);
                    setShowDetailsModal(true);
                  }}
                  className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center"
                >
                  <FaEye className="mr-2" /> View Details
                </button>
                {application.status === "pending" && (
                  <>
                    <button onClick={() => handleApprove(application.id)} className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center">
                      <FaCheckCircle className="mr-2" /> Approve
                    </button>
                    <button onClick={() => handleReject(application.id)} className="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center">
                      <FaTimesCircle className="mr-2" /> Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedApplication && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">KYC Application Details</h3>
                <button onClick={() => setShowDetailsModal(false)} className="p-2 hover:bg-slate-100 rounded-lg"><FaTimesCircle /></button>
              </div>
              
              <div className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h4 className="text-lg font-semibold mb-3 flex items-center"><FaUserCheck className="mr-2 text-emerald-600" /> Personal Information</h4>
                  <div className="grid md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                    <div><p className="text-sm text-slate-500">Full Name</p><p className="font-medium">{selectedApplication.name}</p></div>
                    <div><p className="text-sm text-slate-500">Email</p><p className="font-medium">{selectedApplication.email}</p></div>
                    <div><p className="text-sm text-slate-500">Phone</p><p className="font-medium">{selectedApplication.phone}</p></div>
                    <div><p className="text-sm text-slate-500">Date of Birth</p><p className="font-medium">{selectedApplication.dateOfBirth}</p></div>
                    <div><p className="text-sm text-slate-500">Nationality</p><p className="font-medium">{selectedApplication.nationality}</p></div>
                    <div><p className="text-sm text-slate-500">Occupation</p><p className="font-medium">{selectedApplication.occupation}</p></div>
                  </div>
                </div>

                {/* Address Information */}
                <div>
                  <h4 className="text-lg font-semibold mb-3 flex items-center"><FaMapMarkerAlt className="mr-2 text-emerald-600" /> Address Information</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-medium">{selectedApplication.address}</p>
                  </div>
                </div>

                {/* Document Information */}
                <div>
                  <h4 className="text-lg font-semibold mb-3 flex items-center"><FaFileAlt className="mr-2 text-emerald-600" /> Document Information</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div><p className="text-sm text-slate-500">Document Type</p><p className="font-medium">{selectedApplication.documentType}</p></div>
                      <div><p className="text-sm text-slate-500">Document Number</p><p className="font-medium">{selectedApplication.documentNumber}</p></div>
                    </div>
                    <div className="space-y-2">
                      {selectedApplication.documents.map((doc, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 bg-white rounded">
                          <span>{doc.type}</span>
                          <div className="flex items-center space-x-2">
                            <span className={doc.status === "verified" ? "text-green-600" : doc.status === "uploaded" ? "text-blue-600" : "text-red-600"}>
                              {doc.status}
                            </span>
                            <button className="text-blue-600 hover:text-blue-700"><FaDownload /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Verification Notes */}
                {selectedApplication.status !== "pending" && (
                  <div>
                    <h4 className="text-lg font-semibold mb-3">Verification Notes</h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm">
                        {selectedApplication.status === "approved" 
                          ? `Approved on ${selectedApplication.approvedDate}` 
                          : `Rejected with reason: Insufficient documentation`}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {selectedApplication.status === "pending" && (
                <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
                  <button onClick={() => handleReject(selectedApplication.id)} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Reject</button>
                  <button onClick={() => handleApprove(selectedApplication.id)} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Approve</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KYCModule;