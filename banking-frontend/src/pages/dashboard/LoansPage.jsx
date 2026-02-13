import { useEffect, useState } from "react";
import DashboardLayout from "../../layout/DashboardLayout";
import Table from "../../components/Table";
import StatusBadge from "../../components/StatusBadge";
import LoanApplicationModal from "../../components/LoanApplicationModal";
import api_loan from "../../api/axiosLoan";

// Loan type configuration matching your backend enum EXACTLY
const loanTypes = [
  {
    value: "HOME_LOAN",
    label: "Home Loan",
    minAmount: 500000,
    maxAmount: 10000000,
    minTenure: 12,
    maxTenure: 360,
    interestRate: 8.5,
    description: "For purchasing or constructing a residential property"
  },
  {
    value: "PERSONAL_LOAN",
    label: "Personal Loan",
    minAmount: 50000,
    maxAmount: 2000000,
    minTenure: 12,
    maxTenure: 60,
    interestRate: 12.5,
    description: "For personal expenses, travel, or emergencies"
  },
  {
    value: "VEHICLE_LOAN",
    label: "Vehicle Loan",
    minAmount: 100000,
    maxAmount: 5000000,
    minTenure: 12,
    maxTenure: 84,
    interestRate: 9.2,
    description: "For purchasing new or used vehicles"
  },
  {
    value: "EDUCATION_LOAN",
    label: "Education Loan",
    minAmount: 50000,
    maxAmount: 2000000,
    minTenure: 12,
    maxTenure: 120,
    interestRate: 10.0,
    description: "For educational expenses and tuition fees"
  },
  {
    value: "BUSINESS_LOAN",
    label: "Business Loan",
    minAmount: 100000,
    maxAmount: 5000000,
    minTenure: 12,
    maxTenure: 120,
    interestRate: 11.5,
    description: "For business expansion and working capital"
  }
];

export default function LoansPage() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });
  const username = localStorage.getItem('username');
  const accountNumber = localStorage.getItem(`accountNumber-${username}`);
 
  

  // Show notification
  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 5000);
  };

  // Fetch loans data from API
  const fetchLoans = async () => {
    try {
      setLoading(true);
      setError("");
      
      console.log("Fetching loans for account:", accountNumber);
      
      // Your backend endpoint: GET /api/loans/account/{accountNumber}
      const response = await api_loan.get(`/api/loans/account/${accountNumber}`);
      
      console.log("Loans API Response:", response.data);
      
      // Your backend returns ResponseEntity<?> - it could be an array or object
      const responseData = response.data;
      
      // Check if response is an error message string
      if (typeof responseData === 'string' && responseData.includes("❌")) {
        throw new Error(responseData);
      }
      
      // Check if response is an array
      if (Array.isArray(responseData)) {
        setLoans(responseData);
      } 
      // Check if response has a data property that's an array
      else if (responseData && Array.isArray(responseData.data)) {
        setLoans(responseData.data);
      }
      // Check if response is an object (single loan)
      else if (responseData && typeof responseData === 'object') {
        setLoans([responseData]);
      }
      else {
        setLoans([]);
      }
      
    } catch (err) {
      console.error("Error fetching loans:", err);
      const errorMsg = err.response?.data || err.message || "Failed to load loans data";
      setError(typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg));
      setLoans([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Refresh loans data
  const handleRefresh = () => {
    setRefreshing(true);
    fetchLoans();
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  // Handle loan application submission
  const handleLoanApplication = async (applicationData) => {
    try {
      setError("");
      
      console.log("Original application data:", applicationData);
      
      // Prepare payload EXACTLY matching your LoanRequestDto
      const payload = {
        accountNumber: accountNumber,
        loanType: applicationData.loanType, // Must match backend enum: HOME_LOAN, PERSONAL_LOAN, etc.
        principalAmount: parseFloat(applicationData.principal),
        interestRate: parseFloat(applicationData.interestRate),
        tenureMonths: parseInt(applicationData.tenureMonths)
      };

      console.log("Submitting loan application payload:", payload);
      console.log("Payload type check - loanType:", typeof payload.loanType, "value:", payload.loanType);

      // Your backend endpoint: POST /api/loans
      const response = await api_loan.post("/api/loans", payload);
      
      console.log("Loan application response:", response.data);
      
      // Check if response contains error message
      if (typeof response.data === 'string' && response.data.includes("❌")) {
        throw new Error(response.data);
      }
      
      if (response.status === 200 || response.status === 201) {
        showNotification("Loan application submitted successfully! Your application is under review.", "success");
        setShowApplicationModal(false);
        fetchLoans(); // Refresh the loans list
      } else {
        throw new Error(response.data?.message || "Failed to submit loan application");
      }
      
    } catch (err) {
      console.error("Loan application error:", err.response?.data || err);
      const errorMessage = err.response?.data || err.message || "Error submitting application";
      setError(typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage));
      showNotification(typeof errorMessage === 'string' ? errorMessage : "Error submitting application", "error");
    }
  };



//  handel repayment
const handleRePayment = async (loanId) => {
  try {
   


    const response = await api_loan.post(`/api/loans/${loanId}repay`);

    console.log("Repayment response:", response.data);

    if (response.status === 200) {
      showNotification("Loan repayment successful!", "success");
      fetchLoans(); // refresh table
    } else {
      throw new Error(response.data?.message || "Repayment failed");
    }

  } catch (err) {
    console.error("Repayment error:", err.response?.data || err);

    const errorMessage =
      err.response?.data ||
      err.message ||
      "Failed to process repayment";

    showNotification(
      typeof errorMessage === "string"
        ? errorMessage
        : "Failed to process repayment",
      "error"
    );
  }
};

  // Calculate EMI
  const calculateEMI = (principal, interestRate, tenureMonths) => {
    if (!principal || !interestRate || !tenureMonths) return 0;
    
    const monthlyRate = interestRate / 12 / 100;
    const emi = principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths) / 
               (Math.pow(1 + monthlyRate, tenureMonths) - 1);
    return Math.round(emi);
  };

  // Calculate remaining months
  const calculateRemainingMonths = (startDate, endDate, tenureMonths) => {
    if (!startDate) return tenureMonths;
    
    try {
      const start = new Date(startDate);
      const now = new Date();
      
      if (endDate) {
        const end = new Date(endDate);
        if (now > end) return 0;
      }
      
      const monthsPaid = (now.getFullYear() - start.getFullYear()) * 12 + 
                        (now.getMonth() - start.getMonth());
      return Math.max(0, tenureMonths - monthsPaid);
    } catch (e) {
      return tenureMonths;
    }
  };

  const columns = [
    { 
      header: "Loan ID", 
      accessor: "id",
      render: (val) => `LN${String(val || "").padStart(6, '0')}`
    },
    { 
      header: "Type", 
      accessor: "loanType",
      render: (val) => {
        const loanType = loanTypes.find(lt => lt.value === val);
        return loanType ? loanType.label : val || "N/A";
      }
    },
    {
      header: "Principal",
      accessor: "principalAmount",
      render: (val) => {
        const amount = parseFloat(val) || 0;
        return `₹ ${amount.toLocaleString("en-IN")}`;
      },
    },
    {
      header: "EMI",
      accessor: "emiAmount",
      render: (val, row) => {
        if (val) {
          const amount = parseFloat(val) || 0;
          return `₹ ${amount.toLocaleString("en-IN")}`;
        }
        
        // Calculate EMI if not provided
        const principal = parseFloat(row.principalAmount) || 0;
        const interestRate = parseFloat(row.interestRate) || 0;
        const tenureMonths = parseInt(row.tenureMonths) || 0;
        
        if (principal && interestRate && tenureMonths) {
          const emi = calculateEMI(principal, interestRate, tenureMonths);
          return `₹ ${emi.toLocaleString("en-IN")}`;
        }
        return "₹ 0";
      },
    },
    {
      header: "Interest Rate",
      accessor: "interestRate",
      render: (val) => `${parseFloat(val) || "0"}%`,
    },
    {
      header: "Tenure",
      accessor: "tenureMonths",
      render: (val) => {
        const months = parseInt(val) || 0;
        if (!months) return "0 mos";
        const years = Math.floor(months / 12);
        const remainingMonths = months % 12;
        return `${years > 0 ? `${years} yrs ` : ""}${remainingMonths} mos`;
      },
    },
    {
      header: "Remaining",
      accessor: "remainingMonths",
      render: (val, row) => {
        if (val !== undefined && val !== null) {
          const months = parseInt(val) || 0;
          const years = Math.floor(months / 12);
          const remainingMonths = months % 12;
          return `${years > 0 ? `${years} yrs ` : ""}${remainingMonths} mos`;
        }
        
        // Calculate remaining months if not provided
        const remaining = calculateRemainingMonths(row.startDate, row.endDate, row.tenureMonths);
        const years = Math.floor(remaining / 12);
        const months = remaining % 12;
        return `${years > 0 ? `${years} yrs ` : ""}${months} mos`;
      },
    },
    {
      header: "Applied Date",
      accessor: "startDate",
      render: (val) => {
        if (!val) return "-";
        try {
          return new Date(val).toLocaleDateString("en-IN");
        } catch (e) {
          return val;
        }
      },
    },
    {
      header: "Status",
      accessor: "status",
      render: (val) => <StatusBadge status={val} />,
    },
    {
      header: "Actions",
      accessor: "id",
      render: (id, row) => (
        <div className="flex space-x-2">
          
          {(row.status === "ACTIVE" || row.status === "APPROVED") && (
            <button 
              className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded hover:bg-blue-200 transition-colors"
              onClick={() => handleRePayment(id)}
            >
              Repay
            </button>
          )}
        </div>
      ),
    },
  ];

  // Calculate summary statistics
  const totalLoans = loans.length;
  const activeLoans = loans.filter(loan => 
    loan.status === "ACTIVE" || loan.status === "APPROVED"
  ).length;
  const pendingLoans = loans.filter(loan => loan.status === "PENDING").length;
  const totalPrincipal = loans.reduce((sum, loan) => 
    sum + (parseFloat(loan.principalAmount) || 0), 0);
  
  const totalEMI = loans
    .filter(loan => loan.status === "ACTIVE" || loan.status === "APPROVED")
    .reduce((sum, loan) => {
      if (loan.emiAmount) {
        return sum + (parseFloat(loan.emiAmount) || 0);
      }
      
      const principal = parseFloat(loan.principalAmount) || 0;
      const interestRate = parseFloat(loan.interestRate) || 0;
      const tenureMonths = parseInt(loan.tenureMonths) || 0;
      
      if (principal && interestRate && tenureMonths) {
        return sum + calculateEMI(principal, interestRate, tenureMonths);
      }
      return sum;
    }, 0);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-lg text-gray-600">Loading loans data...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Notification */}
        {notification.show && (
          <div className={`px-4 py-3 rounded-lg ${notification.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : notification.type === 'error' ? 'bg-red-50 text-red-800 border border-red-200' : 'bg-blue-50 text-blue-800 border border-blue-200'}`}>
            <div className="flex items-center justify-between">
              <span>{notification.message}</span>
              <button 
                onClick={() => setNotification({ show: false, message: "", type: "" })}
                className="ml-4"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Loan Management</h1>
            <p className="text-gray-600">Manage and track your loan accounts</p>
          </div>
          <div className="flex space-x-3">
            <button 
              onClick={handleRefresh}
              disabled={refreshing}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors duration-200 flex items-center disabled:opacity-50"
            >
              {refreshing ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Refreshing...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh
                </>
              )}
            </button>
            <button 
              onClick={() => setShowApplicationModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Apply for Loan
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="break-words">{error}</span>
              <button 
                onClick={() => setError("")}
                className="text-red-700 hover:text-red-900 ml-4 flex-shrink-0"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Loans", value: totalLoans, color: "text-gray-900", bg: "bg-blue-50", icon: "📋" },
            { label: "Active Loans", value: activeLoans, color: "text-green-600", bg: "bg-green-50", icon: "✅" },
            { label: "Pending", value: pendingLoans, color: "text-yellow-600", bg: "bg-yellow-50", icon: "⏳" },
            { label: "Monthly EMI", value: `₹ ${totalEMI.toLocaleString("en-IN")}`, color: "text-blue-600", bg: "bg-indigo-50", icon: "💰" },
          ].map((card, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-600">{card.label}</div>
                  <div className={`text-2xl font-bold ${card.color}`}>{card.value}</div>
                </div>
                <div className={`p-3 ${card.bg} rounded-lg`}>
                  <span className="text-2xl">{card.icon}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Loans Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="px-4 sm:px-6 py-4 border-b flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
            <h2 className="text-lg font-semibold text-gray-800">Loan Applications</h2>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                Showing {loans.length} loan{loans.length !== 1 ? 's' : ''}
              </span>
              {loans.length > 0 && (
                <span className="text-sm text-gray-500">
                  Total Principal: ₹ {totalPrincipal.toLocaleString("en-IN")}
                </span>
              )}
            </div>
          </div>
          
          {loans.length > 0 ? (
            <div className="overflow-x-auto">
              <Table columns={columns} data={loans} />
            </div>
          ) : (
            <div className="text-center py-12 px-4">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No loans found</h3>
              <p className="text-gray-500 mb-6">
                {error ? "Error loading loans. Please try again." : "You don't have any loan applications yet."}
              </p>
              <button
                onClick={() => setShowApplicationModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg className="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Apply for Loan
              </button>
            </div>
          )}
        </div>

        {/* Loan Application Modal */}
        {showApplicationModal && (
          <LoanApplicationModal
            loanTypes={loanTypes}
            onSubmit={handleLoanApplication}
            onClose={() => setShowApplicationModal(false)}
          />
        )}
      </div>
    </DashboardLayout>
  );
}