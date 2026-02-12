import React, { useState } from "react";
import axios from "axios";

import { useNavigate } from "react-router-dom";

const KycPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    documentType: "PAN",
    name: "",
    dob: "",
    documentNumber: "",
  });

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
const navigate = useNavigate();

  // Handle text input
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle file input
  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  // Submit KYC
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      setMessage("❌ Please upload document image");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");

      // Create multipart form
      const data = new FormData();

      // Convert object to JSON string
      data.append("data", JSON.stringify(formData));
      data.append("image", image);

      const res = await axios.post(
        "http://localhost:8087/api/kyc/verify",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMessage("✅ KYC submitted successfully. Waiting for verification.");
     if (res.data.status === "VERIFIED") {navigate("/dashboard/profile");
}

      console.log("KYC Response:", res.data);
    } catch (err) {
      console.error(err);

      setMessage(
        err.response?.data?.message ||
          "❌ Failed to submit KYC. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-xl p-6">

        <h2 className="text-2xl font-bold text-center mb-6">
          KYC Verification
        </h2>

        {message && (
          <p className="text-center mb-4 text-sm font-medium">
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* DOB */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Date of Birth
            </label>
            <input
              type="date"
              name="dob"
              required
              value={formData.dob}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Document Type */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Document Type
            </label>
            <select
              name="documentType"
              value={formData.documentType}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="PAN">PAN Card</option>
              <option value="AADHAAR">Aadhaar Card</option>
            </select>
          </div>

          {/* Document Number */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Document Number
            </label>
            <input
              type="text"
              name="documentNumber"
              required
              value={formData.documentNumber}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Upload Image */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Upload Document Image
            </label>
            <input
              type="file"
              accept="image/*"
              required
              onChange={handleFileChange}
              className="w-full border px-3 py-2 rounded bg-white"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:bg-gray-400"
          >
            {loading ? "Submitting..." : "Submit KYC"}
          </button>
        </form>

      </div>
    </div>
  );
};

export default KycPage;
