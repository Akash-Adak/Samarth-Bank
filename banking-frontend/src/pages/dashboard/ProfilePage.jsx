import { useState, useEffect } from "react";
import DashboardLayout from "../../layout/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import { User, Mail, Phone, Edit2, Save, X } from "lucide-react";
import api from "../../api/axios";
import axios from "axios";

export default function ProfilePage() {
  const { token } = useAuth();

  const [profile, setProfile] = useState({
    username: "",
    fullname: "",
    email: "",
    phone: "",
    address: "",
    accountNumber: "",
    kycStatus: "",
    dob:"",
    docType:"",
    docHash:""
  });

  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
  });

  // 🔥 LOAD PROFILE
  const loadProfile = async () => {
    try {
      const username = localStorage.getItem("username");
      const res = await api.get(`/api/users/${username}`);
            console.log(res);
      setProfile({
        username: res.data.username || "",
        fullname: res.data.fullname || "",
        email: res.data.email || "",
        phone: res.data.phone || "",
        address: res.data.address || "",
        accountNumber: res.data.accountNumber || "",
        kycStatus: res.data.kycStatus || "",
      });

      setLoading(false);
    } catch (err) {
      console.error("Failed to load profile", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  // 🔥 UPDATE PROFILE (PUT /api/users)
  const handleSave = async () => {
    try {
      await api.put("/api/users", {
        username: profile.username,
        fullname: profile.fullname,
        email: profile.email,
        phone: profile.phone,
        address: profile.address,
        accountNumber: profile.accountNumber,
        kycStatus: profile.kycStatus,
        dob:profile.dob,
    docType:profile.docType,
    docHash:profile.docHash
      });

      setIsEditing(false);
      setMessage("Profile updated successfully!");

      loadProfile();
    } catch (err) {
      console.error(err);
      setMessage("Failed to update profile.");
    }
  };

  // 🔥 CHANGE PASSWORD
  const handleChangePassword = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_AUTH_URL}/auth/change-password`,
        passwordData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setPasswordData({ oldPassword: "", newPassword: "" });
      setMessage("Password changed successfully!");
    } catch (err) {
      console.error(err);
      setMessage("Failed to change password.");
    }
  };

  if (loading)
    return (
      <DashboardLayout>
        <p className="text-gray-500">Loading profile...</p>
      </DashboardLayout>
    );

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>

      {message && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
          {message}
        </div>
      )}

      {/* MAIN CARD */}
      <div className="bg-white p-6 rounded-xl shadow mb-10">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center text-4xl font-semibold text-gray-600">
              {profile.fullname[0] || "U"}
            </div>

            <div>
              <h2 className="text-2xl font-semibold">{profile.fullname}</h2>
              <p className="text-gray-500 text-sm">Account #{profile.accountNumber}</p>
            </div>
          </div>

          <button
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
            onClick={() => setIsEditing(true)}
          >
            <Edit2 size={16} /> Edit Profile
          </button>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <p className="text-gray-500 text-sm">Full Name</p>
            <div className="flex items-center gap-2 mt-1">
              <User size={18} className="text-gray-400" />
              <p className="font-medium">{profile.fullname}</p>
            </div>
          </div>

          <div>
            <p className="text-gray-500 text-sm">Email</p>
            <div className="flex items-center gap-2 mt-1">
              <Mail size={18} className="text-gray-400" />
              <p className="font-medium">{profile.email}</p>
            </div>
          </div>

          <div>
            <p className="text-gray-500 text-sm">Phone</p>
            <div className="flex items-center gap-2 mt-1">
              <Phone size={18} className="text-gray-400" />
              <p className="font-medium">{profile.phone || "Not added"}</p>
            </div>
          </div>

          <div>
            <p className="text-gray-500 text-sm">Address</p>
            <p className="font-medium">{profile.address || "Not added"}</p>
          </div>
        </div>
      </div>

      {/* EDIT MODAL */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-lg shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Edit Profile</h2>
              <button
                className="text-gray-600 hover:text-gray-800"
                onClick={() => setIsEditing(false)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Full Name"
                className="border p-3 rounded-lg"
                value={profile.fullname}
                onChange={(e) =>
                  setProfile({ ...profile, fullname: e.target.value })
                }
              />

              <input
                type="email"
                placeholder="Email"
                className="border p-3 rounded-lg"
                value={profile.email}
                onChange={(e) =>
                  setProfile({ ...profile, email: e.target.value })
                }
              />

              <input
                type="tel"
                placeholder="Phone"
                className="border p-3 rounded-lg"
                value={profile.phone}
                onChange={(e) =>
                  setProfile({ ...profile, phone: e.target.value })
                }
              />

              <input
                type="text"
                placeholder="Address"
                className="border p-3 rounded-lg"
                value={profile.address}
                onChange={(e) =>
                  setProfile({ ...profile, address: e.target.value })
                }
              />
              <input
                type="date"
                placeholder="date of birth"
                className="border p-3 rounded-lg"
                value={profile.dob}
                onChange={(e) =>
                  setProfile({ ...profile, dob: e.target.value })
                }
              />
             <select
              className="border p-3 rounded-lg"
              value={profile.docType}
              onChange={(e) =>
                setProfile({ ...profile, docType: e.target.value })
              }
            >
              <option value="">Select Document Type</option>
              <option value="AADHAAR">AADHAAR</option>
              <option value="PAN">PAN</option>
            </select>

              <input
                type="text"
                placeholder="docNumber"
                className="border p-3 rounded-lg"
                value={profile.docHash}
                onChange={(e) =>
                  setProfile({ ...profile, docHash: e.target.value })
                }
              />
            </div>

            <div className="flex justify-end gap-3 mt-5">
              <button
                className="px-4 py-2 bg-gray-200 rounded-lg"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>

              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                onClick={handleSave}
              >
                <Save size={16} className="inline mr-1" />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
