import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../layout/DashboardLayout";
import { transferMoney } from "../../api/transactionApi";

export default function SendMoney() {
  const navigate = useNavigate();

  const username = localStorage.getItem("username");
  const fromAccount = localStorage.getItem(`accountNumber-${username}`);
  const token = localStorage.getItem("token");

  const balance = Number(localStorage.getItem("accountBalance") || 0);

  const [step, setStep] = useState(0); // 0=form 1=review 2=pin 3=loading 4=success
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    toAccount: "",
    confirm: "",
    amount: "",
  });

  const [errors, setErrors] = useState({});
  const [pin, setPin] = useState(["", "", "", ""]);

  /* ---------------- VALIDATION ---------------- */

  const validate = () => {
    const e = {};

    if (!/^\d{9,18}$/.test(form.toAccount))
      e.toAccount = "Invalid Account Number";

    if (form.toAccount !== form.confirm)
      e.confirm = "Account numbers do not match";

    if (!form.amount || form.amount <= 0)
      e.amount = "Invalid Amount";

    if (Number(form.amount) > balance)
      e.amount = "Insufficient Balance";

    setErrors(e);

    return Object.keys(e).length === 0;
  };

  /* ---------------- PIN ---------------- */

  const handlePin = (i, v) => {
    if (!/^\d?$/.test(v)) return;

    const p = [...pin];
    p[i] = v;
    setPin(p);

    if (v && i < 3) {
      document.getElementById(`pin-${i + 1}`)?.focus();
    }
  };

  const handlePinKeyDown = (i, e) => {
    if (e.key === "Backspace" && !pin[i] && i > 0) {
      document.getElementById(`pin-${i - 1}`)?.focus();
    }
  };

  /* ---------------- REAL TRANSFER ---------------- */

  const handleTransfer = async () => {
    if (loading) return;

    if (pin.join("").length !== 4) {
      alert("Enter 4-digit PIN");
      return;
    }

    setLoading(true);
    setStep(3);

    try {
      await transferMoney({
        fromAccount: fromAccount,
        toAccount: form.toAccount,
        amount: Number(form.amount),
        type: "TRANSFER",
      });

      // Update balance locally
      const newBal = balance - Number(form.amount);
      localStorage.setItem("accountBalance", newBal);

      setStep(4);
    } catch (error) {
      console.error("Transaction error:", error.response?.data || error.message);
      alert("Transaction Failed");
      setStep(2);
    }

    setLoading(false);
  };

  /* ---------------- RESET ---------------- */

  const reset = () => {
    setForm({
      toAccount: "",
      confirm: "",
      amount: "",
    });
    setPin(["", "", "", ""]);
    setErrors({});
    setLoading(false);
    setStep(0);
  };

  /* =====================================================
     FORM
     ===================================================== */

  if (step === 0)
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4">
                <h1 className="text-xl font-bold text-white">Send Money</h1>
                <p className="text-blue-100 text-sm mt-1">Transfer to any bank account</p>
              </div>

              {/* Balance Card */}
              <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600">From Account</p>
                    <p className="font-mono text-gray-800">**** {fromAccount?.slice(-4)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Available Balance</p>
                    <p className="text-xl font-bold text-green-600">₹{balance.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Form */}
              <div className="p-6 space-y-5">
                {/* To Account */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Receiver's Account Number
                  </label>
                  <input
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Enter account number"
                    value={form.toAccount}
                    maxLength={18}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        toAccount: e.target.value.replace(/\D/g, ""),
                      })
                    }
                  />
                  {errors.toAccount && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.toAccount}
                    </p>
                  )}
                </div>

                {/* Confirm Account */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Account Number
                  </label>
                  <input
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Re-enter account number"
                    value={form.confirm}
                    maxLength={18}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        confirm: e.target.value.replace(/\D/g, ""),
                      })
                    }
                  />
                  {errors.confirm && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.confirm}
                    </p>
                  )}
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount (₹)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-3 text-gray-500">₹</span>
                    <input
                      type="number"
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="0.00"
                      value={form.amount}
                      onChange={(e) =>
                        setForm({ ...form, amount: e.target.value })
                      }
                    />
                  </div>
                  {errors.amount && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.amount}
                    </p>
                  )}
                </div>

                {/* Quick Amount Selector */}
                <div className="flex gap-2 pt-2">
                  {[500, 1000, 2000, 5000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setForm({ ...form, amount: amt })}
                      className="flex-1 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      ₹{amt}
                    </button>
                  ))}
                </div>

                {/* Continue Button */}
                <button
                  onClick={() => validate() && setStep(1)}
                  className="w-full mt-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-3 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-800 transform transition-all duration-200 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Continue
                </button>

                {/* Back Button */}
                <button
                  onClick={() => navigate(-1)}
                  className="w-full text-gray-600 py-2 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );

  /* =====================================================
     REVIEW
     ===================================================== */

  if (step === 1)
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4">
                <h2 className="text-xl font-bold text-white">Review Transfer</h2>
                <p className="text-blue-100 text-sm mt-1">Please verify the details</p>
              </div>

              <div className="p-6">
                {/* Transaction Details */}
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                    <span className="text-gray-600">From Account</span>
                    <span className="font-mono font-medium">**** {fromAccount?.slice(-4)}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                    <span className="text-gray-600">To Account</span>
                    <span className="font-mono font-medium">{form.toAccount.slice(0,4)}...{form.toAccount.slice(-4)}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                    <span className="text-gray-600">Amount</span>
                    <span className="text-xl font-bold text-green-600">₹{Number(form.amount).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Transaction Fee</span>
                    <span className="font-medium text-green-600">Free</span>
                  </div>
                </div>

                {/* Total */}
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">Total Debit</span>
                    <span className="text-xl font-bold text-blue-700">₹{Number(form.amount).toLocaleString()}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setStep(0)}
                    className="flex-1 py-3 border-2 border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setStep(2)}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-3 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-800 transform transition-all duration-200 hover:scale-[1.02]"
                  >
                    Proceed to Pay
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );

  /* =====================================================
     PIN
     ===================================================== */

  if (step === 2)
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4">
                <h2 className="text-xl font-bold text-white">Enter PIN</h2>
                <p className="text-blue-100 text-sm mt-1">Enter your 4-digit transaction PIN</p>
              </div>

              <div className="p-8 text-center">
                {/* Amount Display */}
                <div className="mb-6">
                  <p className="text-sm text-gray-600">Amount to transfer</p>
                  <p className="text-3xl font-bold text-blue-600">₹{Number(form.amount).toLocaleString()}</p>
                </div>

                {/* PIN Input */}
                <div className="flex justify-center gap-3 mb-8">
                  {[0, 1, 2, 3].map((i) => (
                    <input
                      key={i}
                      id={`pin-${i}`}
                      type="password"
                      maxLength={1}
                      className="w-14 h-14 border-2 border-gray-300 rounded-lg text-center text-2xl font-bold focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                      value={pin[i]}
                      onChange={(e) => handlePin(i, e.target.value)}
                      onKeyDown={(e) => handlePinKeyDown(i, e)}
                      autoFocus={i === 0}
                    />
                  ))}
                </div>

                {/* Confirm Button */}
                <button
                  onClick={handleTransfer}
                  disabled={loading || pin.join("").length !== 4}
                  className={`w-full py-3 rounded-lg font-medium transform transition-all duration-200 hover:scale-[1.02] ${
                    pin.join("").length === 4
                      ? "bg-gradient-to-r from-blue-600 to-indigo-700 text-white hover:from-blue-700 hover:to-indigo-800"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Confirm Payment
                </button>

                {/* Back Button */}
                <button
                  onClick={() => setStep(1)}
                  className="w-full mt-3 text-gray-600 py-2 hover:text-gray-800 transition-colors"
                >
                  Back
                </button>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );

  /* =====================================================
     LOADING
     ===================================================== */

  if (step === 3)
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="text-center">
                {/* Spinner */}
                <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent"></div>
                
                <h3 className="text-xl font-bold text-gray-800 mt-6">Processing Transaction</h3>
                <p className="text-gray-600 mt-2">Please wait while we process your payment</p>
                
                {/* Progress Bar */}
                <div className="mt-6 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-600 to-indigo-700 animate-pulse rounded-full" style={{ width: '60%' }}></div>
                </div>
                
                <p className="text-sm text-gray-500 mt-4">Do not close this window</p>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );

  /* =====================================================
     SUCCESS
     ===================================================== */

  if (step === 4)
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-8 text-center">
                {/* Success Icon */}
                <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-4">
                  <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-white">Transaction Successful!</h2>
              </div>

              <div className="p-6">
                {/* Transaction Details */}
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                    <span className="text-gray-600">Amount Sent</span>
                    <span className="text-2xl font-bold text-green-600">₹{Number(form.amount).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                    <span className="text-gray-600">To Account</span>
                    <span className="font-mono font-medium">{form.toAccount.slice(0,4)}...{form.toAccount.slice(-4)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Date & Time</span>
                    <span className="text-sm">{new Date().toLocaleString()}</span>
                  </div>
                </div>

                {/* New Balance */}
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">New Balance</span>
                    <span className="text-xl font-bold text-blue-700">₹{(balance - Number(form.amount)).toLocaleString()}</span>
                  </div>
                </div>

                {/* Done Button */}
                <button
                  onClick={reset}
                  className="w-full mt-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-3 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-800 transform transition-all duration-200 hover:scale-[1.02]"
                >
                  Done
                </button>

                {/* View Transactions Link */}
                <button
                  onClick={() => navigate('/transactions')}
                  className="w-full mt-3 text-blue-600 py-2 hover:text-blue-800 transition-colors"
                >
                  View Transaction History
                </button>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );

  return null;
}