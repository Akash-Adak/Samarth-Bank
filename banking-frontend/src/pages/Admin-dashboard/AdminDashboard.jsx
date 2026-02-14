import { useEffect, useState } from "react";
import DashboardLayout from "../../layout/DashboardLayout";
import Card from "../../components/Card";
import { useAuth } from "../../context/AuthContext";
import { getAdminDashboard } from "../../api/adminApi";

export default function AdminDashboard() {

  const { user } = useAuth();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const res = await getAdminDashboard();
      setData(res.data);
    } catch (err) {
      console.error("Dashboard error", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <p className="text-center text-gray-500">
          Loading dashboard...
        </p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>

      {/* Header */}
      <div className="flex justify-between items-center mb-6">

        <h1 className="text-3xl font-bold">
          Admin Dashboard
        </h1>

        <p className="text-gray-500">
          {user?.email}
        </p>

      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">

        <Card title="Total Users" value={data.totalUsers} />

        <Card title="Pending KYC" value={data.pendingKyc} />

        <Card title="Pending Accounts" value={data.pendingAccounts} />

       <Card title="Pending Loans" value={data.pendingLoans} link="/admin/loans"/>


        <Card title="Today's Transactions" value={data.todayTransactions} />

        <Card title="Blocked Users" value={data.blockedUsers} />

      </div>

     

    </DashboardLayout>
  );
}

/* Button Component */
function ActionBtn({ text, link }) {
  return (
    <a
      href={link}
      className="bg-blue-600 hover:bg-blue-700 text-white text-center py-2 rounded-lg transition"
    >
      {text}
    </a>
  );
}
