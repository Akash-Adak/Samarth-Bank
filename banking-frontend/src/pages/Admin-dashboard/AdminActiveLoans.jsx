import { useEffect, useState } from "react";
import DashboardLayout from "../../layout/DashboardLayout";
import { getActiveLoans } from "../../api/adminApi";

export default function AdminActiveLoans() {

  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLoans();
  }, []);

  const loadLoans = async () => {
    try {
      const res = await getActiveLoans();
      setLoans(res.data);
    } catch (err) {
      console.error("Active loan fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <p>Loading active loans...</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>

      <h1 className="text-2xl font-bold mb-6">
        Active Loans
      </h1>

      <div className="bg-white shadow rounded-lg overflow-x-auto">

        <table className="w-full text-sm">

          <thead className="bg-gray-100">

            <tr>
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Account Number</th>
              <th className="p-3 text-left">Amount</th>
              <th className="p-3 text-left">Loan Type</th>
              <th className="p-3 text-left">Status</th>
            </tr>

          </thead>

          <tbody>

            {loans.length === 0 && (
              <tr>
                <td
                  colSpan="5"
                  className="p-4 text-center text-gray-500"
                >
                  No active loans
                </td>
              </tr>
            )}

            {loans.map((loan) => (

              <tr key={loan.id} className="border-t">

                <td className="p-3">{loan.id}</td>

                <td className="p-3">{loan.accountNumber}</td>

                <td className="p-3">
                  ₹{loan.principalAmount}
                </td>

                <td className="p-3">
                  {loan.loanType}
                </td>

                <td className="p-3 text-green-600 font-semibold">
                  {loan.status}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </DashboardLayout>
  );
}
