import { useEffect, useState } from "react";
import DashboardLayout from "../../layout/DashboardLayout";
import {
  getPendingLoans,
  approveLoan,
  rejectLoan
} from "../../api/adminApi";

export default function AdminLoans() {

  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLoans();
  }, []);

  const loadLoans = async () => {

    try {
      const res = await getPendingLoans();
      setLoans(res.data);
    } catch (err) {
      console.error("Loan fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {

    if (!window.confirm("Approve this loan?")) return;

    try {
      await approveLoan(id);

      // Remove approved loan from UI
      setLoans(loans.filter(l => l.id !== id));

    } catch (err) {
      alert("Approval failed");
    }
  };

    const handleReject = async (id) => {

    if (!window.confirm("Reject this loan?")) return;

    try {
      await rejectLoan(id);

      // Remove approved loan from UI
      setLoans(loans.filter(l => l.id !== id));

    } catch (err) {
      alert("Approval failed");
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <p>Loading loans...</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>

      <h1 className="text-2xl font-bold mb-6">
        Pending Loans
      </h1>

      <div className="bg-white shadow rounded-lg overflow-x-auto">

        <table className="w-full text-sm">

          <thead className="bg-gray-100">

            <tr>
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Account Number</th>
              <th className="p-3 text-left">Amount</th>
              <th className="p-3 text-left">Loan Type</th>
              {/* <th className="p-3 text-left">Date</th> */}
              <th className="p-3 text-left">Action</th>
            </tr>

          </thead>

          <tbody>

            {loans.length === 0 && (
              <tr>
                <td
                  colSpan="5"
                  className="p-4 text-center text-gray-500"
                >
                  No pending loans
                </td>
              </tr>
            )}

            {loans.map((loan) => (

              <tr key={loan.id} className="border-t">

                <td className="p-3">{loan.id}</td>

                <td className="p-3">{loan.accountNumber}</td>
                <td className="p-3">₹{loan.principalAmount}</td>
                <td className="p-3">{loan.loanType}</td>

                

             

             <td className="p-3 flex justify-center items-center gap-3">

                <button
                  onClick={() => handleApprove(loan.id)}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded transition"
                >
                  Approve
                </button>

                <button
                  onClick={() => handleReject(loan.id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition"
                >
                  Reject
                </button>

            </td>


              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </DashboardLayout>
  );
}
