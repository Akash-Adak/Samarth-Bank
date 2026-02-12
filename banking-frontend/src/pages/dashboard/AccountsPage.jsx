import { useEffect, useState } from "react";
import DashboardLayout from "../../layout/DashboardLayout";
import api_account from "../../api/axiosAccount";
import api_user from "../../api/axios";
import { useNavigate } from "react-router-dom";

// Components
import AccountsHeader from "../../components/account/AccountsHeader";
import StatsOverview from "../../components/account/StatsOverview";
import QuickActions from "../../components/account/QuickActions";
import AccountTable from "../../components/account/AccountTable";
import NewAccountModal from "../../components/account/NewAccountModal";
import ViewAccountModal from "../../components/account/ViewAccountModal";
import EmptyState from "../../components/account/EmptyState";
import MessageAlert from "../../components/account/MessageAlert";

// Config
import { bankConfig, accountTypes } from "../../config/accountsConfig";

export default function AccountsPage() {

  // ================= STATES =================

  const [accounts, setAccounts] = useState([]);
  const [profile, setProfile] = useState(null);

  const [openModal, setOpenModal] = useState(false);
  const [newAccountType, setNewAccountType] = useState("SAVINGS");

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [showBalance, setShowBalance] = useState(false);
  const [copiedAccount, setCopiedAccount] = useState(null);

  const [selectedAccount, setSelectedAccount] = useState(null);
  const [viewModal, setViewModal] = useState(false);

  const username = localStorage.getItem("username");
  const navigate = useNavigate();


  // ================= LOAD PROFILE (KYC DATA) =================

  const loadProfile = async () => {
    try {
      const res = await api_user.get(`/api/users/${username}`);
      setProfile(res.data);
    } catch (err) {
      console.error("Failed to load profile:", err);
    }
  };


  // ================= LOAD ACCOUNTS =================

  const loadAccounts = async () => {
    try {

      setLoading(true);

      const accountNumber =
        localStorage.getItem(`accountNumber-${username}`);

      if (!accountNumber) {
        setAccounts([]);
        setLoading(false);
        return;
      }

      const res = await api_account.get(
        `/api/accounts/user/${accountNumber}`
      );

      let accountsData = [];

      if (Array.isArray(res.data)) {
        accountsData = res.data;
      } else if (res.data && typeof res.data === "object") {
        accountsData = [res.data];
      }

      localStorage.setItem(
        "accountBalance",
        accountsData[0]?.balance || 0
      );

      setAccounts(accountsData);

    } catch (err) {
      console.error("Error loading accounts:", err);
      setAccounts([]);
    } finally {
      setLoading(false);
    }
  };


  // ================= FIRST LOAD =================

  useEffect(() => {
    loadProfile();
    loadAccounts();
  }, []);


  // ================= CREATE ACCOUNT =================

  const createAccount = async (data) => {
  try {
    const payload = {
      type: data.type,
      fullname: data.fullname,
      docType: data.docType,
      docHash: data.docNumber,
      dob: data.dob,
    };

    console.log("Account Payload:", payload);

    const res = await api_account.post("/api/accounts", payload);

    if (accounts.length === 0) {
      localStorage.setItem(
        `accountNumber-${username}`,
        res.data.accountNumber
      );
    }

    setMessage(`🎉 Account created successfully!`);

    setOpenModal(false);
    setNewAccountType("SAVINGS");

    loadAccounts();

  } catch (err) {
    console.error("Account creation error:", err);

    setMessage(
      err.response?.data?.message ||
      "❌ Failed to create account"
    );
  }
};



  // ================= COPY ACCOUNT =================

  const copyAccountNumber = async (accountNumber) => {
    try {
      await navigator.clipboard.writeText(accountNumber);
      setCopiedAccount(accountNumber);

      setTimeout(() => setCopiedAccount(null), 2000);

    } catch (err) {
      console.error("Copy failed:", err);
    }
  };


  // ================= STATS =================

  const getTotalBalance = () => {
    return accounts.reduce(
      (total, acc) => total + (acc.balance || 0),
      0
    );
  };

  const getActiveAccountsCount = () => {
    return accounts.filter(
      acc => acc.status === "ACTIVE"
    ).length;
  };

  const getUniqueAccountTypesCount = () => {
    return new Set(
      accounts.map(acc => acc.accountType)
    ).size;
  };


  // ================= UI =================

  return (
    <DashboardLayout>

      <div className="max-w-7xl mx-auto space-y-6">


        {/* ================= HEADER ================= */}

        <AccountsHeader
          bankConfig={bankConfig}
          showBalance={showBalance}
          setShowBalance={setShowBalance}
          setOpenModal={setOpenModal}
          accountsCount={accounts.length}
          kycStatus={profile?.kycStatus}
        />


        {/* ================= STATS ================= */}

        <StatsOverview
          showBalance={showBalance}
          totalBalance={getTotalBalance()}
          activeAccounts={getActiveAccountsCount()}
          totalAccounts={accounts.length}
          uniqueTypes={getUniqueAccountTypesCount()}
        />


        {/* ================= MESSAGE ================= */}

        <MessageAlert
          message={message}
          setMessage={setMessage}
        />


        {/* ================= QUICK ACTIONS ================= */}

        {profile?.kycStatus === "VERIFIED" && (
          <QuickActions navigate={navigate} />
        )}


        {/* ================= ACCOUNT TABLE ================= */}

        {loading ? (

          <div className="bg-white rounded-2xl shadow-sm border p-8 text-center">

            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>

            <p className="text-gray-600">
              Loading your accounts...
            </p>

          </div>

        ) : accounts.length === 0 ? (

          <EmptyState
            bankConfig={bankConfig}
            setOpenModal={setOpenModal}
          />

        ) : (

          <AccountTable
            accounts={accounts}
            showBalance={showBalance}
            copiedAccount={copiedAccount}
            copyAccountNumber={copyAccountNumber}
            setSelectedAccount={setSelectedAccount}
            setViewModal={setViewModal}
            navigate={navigate}
          />

        )}


        {/* ================= NEW ACCOUNT MODAL ================= */}

        <NewAccountModal
          open={openModal}
          onClose={() => setOpenModal(false)}
          newAccountType={newAccountType}
          setNewAccountType={setNewAccountType}
          createAccount={createAccount}
          // kycStatus={profile?.kycStatus}
          profile={profile}
        />


        {/* ================= VIEW ACCOUNT MODAL ================= */}

        <ViewAccountModal
          open={viewModal}
          onClose={() => setViewModal(false)}
          selectedAccount={selectedAccount}
          copiedAccount={copiedAccount}
          copyAccountNumber={copyAccountNumber}
          navigate={navigate}
        />

      </div>

    </DashboardLayout>
  );
}
