export const formatLoanType = (loanType = '') =>
  String(loanType)
    .split('_')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ') + ' Loan'

export const buildStatusHistory = (loan) => [
  {
    date: loan.createdAt,
    status: 'Application Submitted',
    description: 'Loan application received',
  },
  ...(loan.approvedAt
    ? [{ date: loan.approvedAt, status: 'Approved', description: 'Loan approved by the loan team' }]
    : []),
  ...(loan.disbursedAt
    ? [{ date: loan.disbursedAt, status: 'Disbursed', description: 'Funds disbursed to your account' }]
    : []),
  ...(loan.status === 'rejected'
    ? [{ date: loan.updatedAt, status: 'Rejected', description: loan.adminComment || 'Application rejected' }]
    : []),
]

export const normalizeLoanDocuments = (documents = []) =>
  Array.isArray(documents)
    ? documents.map((doc, index) => ({
        id: doc?._id || doc?.id || `document-${index}`,
        name: doc?.fileName || doc?.originalName || doc?.documentType || `Document ${index + 1}`,
        type: doc?.documentType || 'loan_document',
        url: doc?.cloudinaryUrl || '',
      }))
    : []

export const mapLoanFromApi = (loan) => {
  const paidAmount = Array.isArray(loan?.payments)
    ? loan.payments
        .filter((payment) => payment?.status === 'paid')
        .reduce((sum, payment) => sum + (Number(payment?.amount) || 0), 0)
    : 0
  const total = Number(loan?.totalPayment) || Number(loan?.amount) || 0
  const progress = total > 0 ? Math.min(100, Math.round((paidAmount / total) * 100)) : 0

  return {
    id: loan?.id || loan?._id,
    lookupId: loan?._id || loan?.id,
    type: formatLoanType(loan?.loanType),
    amount: Number(loan?.amount) || 0,
    interestRate: `${Number(loan?.interestRate) || 0}%`,
    interestRateValue: Number(loan?.interestRate) || 0,
    tenure: `${Number(loan?.term) || 0} months`,
    term: Number(loan?.term) || 0,
    status: loan?.status || 'pending',
    appliedDate: loan?.createdAt,
    approvedDate: loan?.approvedAt,
    disbursedDate: loan?.disbursedAt,
    emiAmount: Number(loan?.monthlyPayment) || 0,
    nextEMIDate: loan?.nextPaymentDate,
    remainingAmount: Number.isFinite(Number(loan?.remainingAmount))
      ? Number(loan.remainingAmount)
      : Math.max(0, total - paidAmount),
    progress: Number.isFinite(Number(loan?.progress)) ? Number(loan.progress) : progress,
    purpose: loan?.purpose || '',
    documents: normalizeLoanDocuments(loan?.documents),
    rejectionReason: loan?.status === 'rejected' ? loan?.adminComment : '',
    statusHistory: buildStatusHistory(loan || {}),
    account: loan?.accountId || null,
    updatedAt: loan?.updatedAt,
  }
}
