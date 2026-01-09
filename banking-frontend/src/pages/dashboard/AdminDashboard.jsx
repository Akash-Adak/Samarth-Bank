import DashboardLayout from "../../layout/DashboardLayout";
import Card from "../../components/Card";
import { useAuth } from "../../context/AuthContext";

export default function AdminDashboard() {
  const { user } = useAuth();

  const stats = [
    { title: "Total Users", value: "1,250" },
    { title: "Total Accounts", value: "3,540" },
    { title: "Today's Transactions", value: "5,420" },
    { title: "System Health", value: "OK" },
  ];

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-6">
        Admin Panel
        {user?.email && (
          <span className="text-gray-500 text-lg ml-2">
            – {user.email}
          </span>
        )}
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        {stats.map((item, index) => (
          <Card key={index} title={item.title} value={item.value} />
        ))}
      </div>

      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-3">
          Microservices Overview
        </h2>
        <p className="text-gray-500 text-sm">
          Future integrations: Eureka registry status, Prometheus metrics,
          Kafka consumer lag, service health checks, etc.
        </p>
      </div>
    </DashboardLayout>
  );
}
