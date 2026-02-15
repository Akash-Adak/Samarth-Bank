import { useEffect, useState } from "react";
import DashboardLayout from "../../layout/DashboardLayout";
import Card from "../../components/Card";
import { useAuth } from "../../context/AuthContext";
import { getAdminDashboard } from "../../api/adminApi";
import { 
  Users, 
  FileText, 
  UserCheck, 
  DollarSign, 
  TrendingUp, 
  Ban,
  AlertCircle,
  RefreshCw,
  Download,
  Filter,
  Calendar,
  ChevronRight,
  Activity,
  Clock,
  CheckCircle,
  XCircle
} from "lucide-react";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [dateRange, setDateRange] = useState("today");
  const [showFilters, setShowFilters] = useState(false);

  const loadDashboard = async (showRefresh = false) => {
    try {
      if (showRefresh) setRefreshing(true);
      else setLoading(true);
      
      setError(null);
      const res = await getAdminDashboard(dateRange);
      setData(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load dashboard data");
      console.error("Dashboard error", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, [dateRange]);

  const handleRefresh = () => {
    loadDashboard(true);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num?.toString() || '0';
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading dashboard data...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {getGreeting()}, {user?.name || 'Admin'}!
            </h1>
            <p className="text-gray-500 mt-1">
              Here's what's happening with your platform today.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Date Range Selector */}
            <div className="relative">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2 pr-8 text-sm font-medium text-gray-700 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
                <option value="year">This Year</option>
              </select>
              <Calendar className="absolute right-2 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>

            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`h-5 w-5 ${refreshing ? 'animate-spin' : ''}`} />
            </button>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors md:hidden"
            >
              <Filter className="h-5 w-5" />
            </button>

            {/* Export Button */}
            <button className="hidden md:flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              <Download className="h-4 w-4" />
              Export Report
            </button>
          </div>
        </div>

        {/* User Info Bar */}
        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <Activity className="h-4 w-4" />
            <span>Last login: {user?.lastLogin || 'Today, 10:30 AM'}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Clock className="h-4 w-4" />
            <span>Role: {user?.role || 'Administrator'}</span>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-sm font-medium text-red-800">Error loading dashboard</h3>
            <p className="text-sm text-red-600 mt-1">{error}</p>
          </div>
          <button
            onClick={handleRefresh}
            className="text-sm text-red-600 hover:text-red-800 font-medium"
          >
            Try again
          </button>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        <Card
          title="Total Users"
          value={formatNumber(data?.totalUsers)}
          change={data?.userGrowth}
          icon={Users}
          link="/admin/users"
          color="blue"
        />
        
        <Card
          title="Pending KYC"
          value={data?.pendingKyc}
          icon={FileText}
          link="/admin/users"
          color="yellow"
          badge={data?.pendingKyc > 0}
        />
        
  
        
        <Card
          title="Pending Loans"
          value={data?.pendingLoans}
          icon={DollarSign}
          link="/admin/loans"
          color="purple"
        />
        
        <Card
          title="Today's Transactions"
          value={data?.todayTransactions}
          change={data?.transactionGrowth}
          icon={TrendingUp}
          link="/admin/transactions"
          color="green"
        />
        
        <Card
          title="Blocked Users"
          value={data?.blockedUsers}
          icon={Ban}
          link="/admin/users?status=blocked"
          color="red"
        />
        
        <Card
          title="Active Loans"
          value={data?.activeLoans || '0'}
          icon={CheckCircle}
          link="/admin/loans/active"
          color="emerald"
        />
        
      
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <ActionBtn text="Review KYC" link="/admin/kyc" icon={FileText} />
          <ActionBtn text="Process Loans" link="/admin/loans" icon={DollarSign} />
          <ActionBtn text="View Reports" link="/admin/reports" icon={TrendingUp} />
          <ActionBtn text="Manage Users" link="/admin/users" icon={Users} />
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Recent Users</h3>
              <a href="/admin/users" className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
                View all <ChevronRight className="h-4 w-4" />
              </a>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {data?.recentUsers?.map((user) => (
              <div key={user.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    user.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {user.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Recent Transactions</h3>
              <a href="/admin/transactions" className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
                View all <ChevronRight className="h-4 w-4" />
              </a>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {data?.recentTransactions?.map((transaction) => (
              <div key={transaction.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{transaction.user}</p>
                    <p className="text-sm text-gray-500">{transaction.type}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      ${transaction.amount.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">{transaction.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

/* Enhanced Button Component */
function ActionBtn({ text, link, icon: Icon }) {
  return (
    <a
      href={link}
      className="flex items-center justify-center gap-2 bg-white border border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-gray-700 hover:text-blue-600 py-3 px-4 rounded-lg transition-all group"
    >
      {Icon && <Icon className="h-4 w-4" />}
      <span className="text-sm font-medium">{text}</span>
    </a>
  );
}