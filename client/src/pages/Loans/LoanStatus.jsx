import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const LoanStatus = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - replace with actual API call
  useEffect(() => {
    const mockLoans = [
      {
        id: 'LN-2024-001',
        type: 'Personal Loan',
        amount: 15000,
        appliedDate: '2024-01-15',
        status: 'approved',
        statusMessage: 'Your loan has been approved! Funds will be disbursed within 24 hours.',
        interestRate: '12%',
        tenure: '36 months',
        nextStep: 'Sign loan agreement',
        documents: ['ID Proof', 'Income Certificate', 'Bank Statement'],
        officer: 'John Smith',
        officerContact: 'john.smith@smartbank.com'
      },
      {
        id: 'LN-2024-002',
        type: 'Home Loan',
        amount: 250000,
        appliedDate: '2024-01-10',
        status: 'under_review',
        statusMessage: 'Your application is currently under review by our credit team.',
        interestRate: '8.5%',
        tenure: '240 months',
        nextStep: 'Submit property documents',
        documents: ['Property Papers', 'Construction Estimate'],
        officer: 'Sarah Johnson',
        officerContact: 'sarah.j@smartbank.com'
      },
      {
        id: 'LN-2024-003',
        type: 'Car Loan',
        amount: 35000,
        appliedDate: '2024-01-05',
        status: 'pending',
        statusMessage: 'We have received your application and will begin processing shortly.',
        interestRate: '9.5%',
        tenure: '60 months',
        nextStep: 'Wait for initial review',
        documents: ['Vehicle Quotation', 'Driving License'],
        officer: 'Mike Davis',
        officerContact: 'mike.davis@smartbank.com'
      },
      {
        id: 'LN-2023-045',
        type: 'Education Loan',
        amount: 45000,
        appliedDate: '2023-12-20',
        status: 'rejected',
        statusMessage: 'Unfortunately, your application did not meet our current criteria.',
        interestRate: '10%',
        tenure: '84 months',
        nextStep: 'Contact support for details',
        documents: ['Admission Letter', 'Fee Structure'],
        officer: 'Lisa Wang',
        officerContact: 'lisa.wang@smartbank.com'
      }
    ];

    setTimeout(() => {
      setLoans(mockLoans);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'under_review': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'approved': return 'Approved';
      case 'under_review': return 'Under Review';
      case 'pending': return 'Pending';
      case 'rejected': return 'Rejected';
      default: return status;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return '✅';
      case 'under_review': return '🔍';
      case 'pending': return '⏳';
      case 'rejected': return '❌';
      default: return '📄';
    }
  };

  const filteredLoans = loans.filter(loan =>
    loan.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    loan.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your loan applications...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Loan Application Status</h1>
          <p className="text-gray-600 mt-2">Track and manage your loan applications</p>
        </div>

        {/* Search and Actions */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by Loan ID or Type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex space-x-4">
              <Link
                to="/loans/apply"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Apply for New Loan
              </Link>
            </div>
          </div>
        </div>

        {/* Loans List */}
        <div className="space-y-6">
          {filteredLoans.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <div className="text-gray-400 text-6xl mb-4">📄</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Loan Applications Found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm ? 'No applications match your search criteria.' : "You haven't applied for any loans yet."}
              </p>
              <Link
                to="/loans/apply"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Apply for Your First Loan
              </Link>
            </div>
          ) : (
            filteredLoans.map((loan) => (
              <div key={loan.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                <div className="p-6">
                  {/* Header */}
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{loan.type}</h3>
                      <p className="text-gray-600">Loan ID: {loan.id}</p>
                    </div>
                    <div className="flex items-center space-x-4 mt-2 md:mt-0">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(loan.status)}`}>
                        {getStatusIcon(loan.status)} {getStatusText(loan.status)}
                      </span>
                      <span className="text-lg font-bold text-gray-900">
                        ${loan.amount.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Applied Date</label>
                      <p className="text-gray-900">{new Date(loan.appliedDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Interest Rate</label>
                      <p className="text-gray-900">{loan.interestRate}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Tenure</label>
                      <p className="text-gray-900">{loan.tenure}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Loan Officer</label>
                      <p className="text-gray-900">{loan.officer}</p>
                    </div>
                  </div>

                  {/* Status Message */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <p className="text-gray-700">{loan.statusMessage}</p>
                  </div>

                  {/* Next Steps and Documents */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Next Step</h4>
                      <p className="text-gray-700">{loan.nextStep}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Required Documents</h4>
                      <ul className="text-gray-700 space-y-1">
                        {loan.documents.map((doc, index) => (
                          <li key={index}>• {doc}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t border-gray-200">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm">
                      View Details
                    </button>
                    <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 text-sm">
                      Download Application
                    </button>
                    <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm">
                      Contact Officer
                    </button>
                    {loan.status === 'rejected' && (
                      <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 text-sm">
                        Re-apply
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Statistics */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{loans.length}</div>
              <div className="text-sm text-gray-600">Total Applications</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {loans.filter(l => l.status === 'approved').length}
              </div>
              <div className="text-sm text-gray-600">Approved</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {loans.filter(l => l.status === 'pending' || l.status === 'under_review').length}
              </div>
              <div className="text-sm text-gray-600">In Progress</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {loans.filter(l => l.status === 'rejected').length}
              </div>
              <div className="text-sm text-gray-600">Rejected</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanStatus;