import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../../layout/DashboardLayout";
import Table from "../../components/Table";
import StatusBadge from "../../components/StatusBadge";
import FilterBar from "../../components/FilterBar";
import { format } from "date-fns";
import api_transaction from "../../api/axiosTransaction"; // 🔥 your axios instance

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
const username=localStorage.getItem("username");
  const accountNumber = localStorage.getItem(`accountNumber-${username}`);

  // 🔥 LOAD TRANSACTIONS FROM BACKEND
  const loadTransactions = async () => {
    try {
      const res = await api_transaction.get(`/api/transactions/history/${accountNumber}`);

      const safeData = Array.isArray(res.data) ? res.data : [];
      setTransactions(safeData);
      setLoading(false);
    } catch (err) {
      console.error("Error loading transactions:", err);
      setTransactions([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  // 🔥 FILTERING LOGIC
  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      if (typeFilter !== "ALL" && t.type !== typeFilter) return false;
      if (statusFilter !== "ALL" && t.status !== statusFilter) return false;

      if (
        search &&
        !(
          t.id?.toLowerCase().includes(search.toLowerCase()) ||
          t.description?.toLowerCase().includes(search.toLowerCase()) ||
          t.accountId?.toLowerCase().includes(search.toLowerCase())
        )
      ) {
        return false;
      }

      return true;
    });
  }, [transactions, typeFilter, statusFilter, search]);

  const columns = [
    {
      header: "Date",
      accessor: "date",
      render: (val) =>
        val ? format(new Date(val), "dd MMM yyyy, HH:mm") : "-",
    },
    { header: "Txn ID", accessor: "id" },
    { header: "Account", accessor: "accountId" },
    {
      header: "Type",
      accessor: "type",
      render: (val) => (
        <span
          className={
            val === "CREDIT"
              ? "text-green-600 font-semibold"
              : "text-red-600 font-semibold"
          }
        >
          {val}
        </span>
      ),
    },
    {
      header: "Amount",
      accessor: "amount",
      render: (val) => `₹ ${Number(val || 0).toLocaleString("en-IN")}`,
    },
    {
      header: "Status",
      accessor: "status",
      render: (val) => <StatusBadge status={val} />,
    },
    { header: "Description", accessor: "description" },
  ];

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-4">Transactions</h1>

      {/* 🔍 Filters */}
      <FilterBar>
        <input
          type="text"
          placeholder="Search by ID, description, account..."
          className="border rounded-lg px-3 py-2 text-sm w-64"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border rounded-lg px-3 py-2 text-sm"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="ALL">All Types</option>
          <option value="CREDIT">Credit</option>
          <option value="DEBIT">Debit</option>
        </select>

        <select
          className="border rounded-lg px-3 py-2 text-sm"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="ALL">All Status</option>
          <option value="COMPLETED">Completed</option>
          <option value="PENDING">Pending</option>
          <option value="FAILED">Failed</option>
        </select>
      </FilterBar>

      {/* 🔥 Loading */}
      {loading && <p className="text-gray-600">Loading transactions...</p>}

      {/* 🚫 No transactions found */}
      {!loading && filtered.length === 0 && (
        <div className="p-6 bg-gray-100 text-gray-700 rounded-lg text-center">
          <p className="text-lg font-medium">No transactions found.</p>
          <p className="text-sm text-gray-500">
            Try adjusting filters or check back later.
          </p>
        </div>
      )}

      {/* 📄 Data Table */}
      {!loading && filtered.length > 0 && (
        <Table columns={columns} data={filtered} />
      )}
    </DashboardLayout>
  );
}
