import { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "../components/Navbar";

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      

        <main className="flex-1 pt-16 px-4 md:px-6 lg:px-8 pb-8 overflow-auto">
          {children}
        </main>
      {/* </div> */}
    </div>
  );
}