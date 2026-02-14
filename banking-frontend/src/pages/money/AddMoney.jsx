import { useState } from "react";
import DashboardLayout from "../../layout/DashboardLayout";
import axios from "axios";

export default function AddMoney() {

  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const username = localStorage.getItem("username");
  const token = localStorage.getItem("token");

  const accountNumber =
    localStorage.getItem(`accountNumber-${username}`);

  const PAYMENT_BASE = "http://localhost:8089/api/payment";

  /* ---------------- CREATE ORDER ---------------- */

  const createOrder = async () => {
    try {

        const res = await axios.post(
        `${PAYMENT_BASE}/create-order`,
        {
          amount: Number(amount),
          accountNumber
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return res.data;

    } catch (err) {

      console.error(err);
      setMessage("Failed to create order ❌");

      return null;
    }
  };

  /* ---------------- VERIFY PAYMENT ---------------- */

  const verifyPayment = async (rzp) => {

    try {

      await axios.post(
        `${PAYMENT_BASE}/verify`,
        {
          orderId: rzp.razorpay_order_id,
          paymentId: rzp.razorpay_payment_id,
          signature: rzp.razorpay_signature,

          accountNumber,
          amount: Number(amount),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("Money Added Successfully ✅");

      // Update balance cache
      const old =
        Number(localStorage.getItem("accountBalance")) || 0;

      localStorage.setItem(
        "accountBalance",
        old + Number(amount)
      );

      setAmount("");

    } catch (err) {

      console.error(err);
      setMessage("Payment Verification Failed ❌");
    }
  };

  /* ---------------- MAIN HANDLER ---------------- */

  const handleAddMoney = async () => {

    if (!amount || Number(amount) <= 0) {
      setMessage("Enter valid amount");
      return;
    }

    setLoading(true);
    setMessage("");

    try {

      // 1️⃣ Create order
      const order = await createOrder();

      if (!order || !order.orderId) {
        setLoading(false);
        return;
      }

      // 2️⃣ Open Razorpay
      const options = {

        key: order.key,          // from backend ✅
        amount: order.amount,   // in paisa ✅
        currency: order.currency,

        name: "VASTA Bank",
        description: "Add Money",

        order_id: order.orderId, // backend field ✅

        handler: function (res) {
          verifyPayment(res);
        },

        prefill: {
          name: username,
        },

        theme: {
          color: "#16a34a",
        },
      };

      const razor = new window.Razorpay(options);
      razor.open();

    } catch (e) {

      console.error(e);
      setMessage("Payment Failed ❌");

    } finally {

      setLoading(false);
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <DashboardLayout>

      <div className="max-w-lg mx-auto mt-10">

        <h1 className="text-2xl font-bold mb-6">
          Add Money
        </h1>

        {message && (
          <div className="p-3 bg-blue-100 rounded mb-4">
            {message}
          </div>
        )}

        <div className="bg-white border p-6 rounded grid gap-4">

          <input
            type="number"
            placeholder="Enter Amount"
            value={amount}
            className="border p-3 rounded"
            onChange={(e) => setAmount(e.target.value)}
          />

          <button
            onClick={handleAddMoney}
            disabled={loading}
            className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {loading ? "Processing..." : "Add Money"}
          </button>

        </div>

      </div>

    </DashboardLayout>
  );
}
