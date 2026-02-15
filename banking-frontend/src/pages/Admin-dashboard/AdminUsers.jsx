import { useEffect, useState } from "react";
import DashboardLayout from "../../layout/DashboardLayout";

import {
  getAllUsers,
  blockUser,
  unBlockUser
} from "../../api/adminApi";

export default function AdminUsers() {

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {

    try {
      const res = await getAllUsers();
      console.log(res.data);
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBlock = async (accountNumber) => {

    if (!window.confirm("Block this user?")) return;

    const res=await blockUser(accountNumber);
  
    loadUsers();
  };

  const handleUnblock = async (accountNumber) => {

    if (!window.confirm("Unblock this user?")) return;

   const res= await unBlockUser(accountNumber);

    loadUsers();
  };

  if (loading) {
    return (
      <DashboardLayout>
        <p>Loading users...</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>

      <h1 className="text-2xl font-bold mb-6">
        User Management
      </h1>

      <div className="bg-white shadow rounded-lg overflow-x-auto">

  <table className="w-full text-sm table-fixed">

    {/* HEADER */}
    <thead className="bg-gray-100 text-gray-700">

      <tr>

        <th className="p-3 w-[6%] text-left">ID</th>

        <th className="p-3 w-[15%] text-left">Name</th>

        <th className="p-3 w-[20%] text-left">Email</th>

        <th className="p-3 w-[12%] text-left">Phone</th>
        <th className="p-3 w-[12%] text-left">Account Number</th>
        <th className="p-3 w-[12%] text-center">KYC</th>

        <th className="p-3 w-[10%] text-center">Status</th>

        <th className="p-3 w-[15%] text-center">Action</th>

      </tr>

    </thead>

    {/* BODY */}
    <tbody>

      {users.map((user) => (

        <tr
          key={user.id}
          className="border-t hover:bg-gray-50 transition"
        >

          <td className="p-3 truncate">
            {user.id}
          </td>

          <td className="p-3 truncate">
            {user.fullname}
          </td>

          <td className="p-3 truncate">
            {user.email}
          </td>

          <td className="p-3 truncate">
            {user.phone}
          </td>

          <td className="p-3 truncate" >{user.accountNumber} </td>
          {/* KYC */}
          <td className="p-3 text-center">

            <span
              className={`px-2 py-1 rounded text-xs font-medium ${
                user.kycStatus === "APPROVED"
                  ? "bg-green-100 text-green-700"
                  : user.kycStatus === "PENDING"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {user.kycStatus}
            </span>

          </td>

          {/* STATUS */}
          <td className="p-3 text-center">

            {user.userStatus==='BLOCKED' ? (
              <span className="text-red-600 font-semibold">
                Blocked
              </span>
            ) : (
              <span className="text-green-600 font-semibold">
                Active
              </span>
            )}

          </td>

          {/* ACTION */}
          <td className="p-3 text-center space-x-2">

            {user.userStatus==='BLOCKED' ? (

              <button
                onClick={() => handleUnblock(user.accountNumber)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs transition"
              >
                Unblock
              </button>

            ) : (

              <button
                onClick={() => handleBlock(user.accountNumber)}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs transition"
              >
                Block
              </button>

            )}

          </td>

        </tr>

      ))}

    </tbody>

  </table>

</div>

    </DashboardLayout>
  );
}
