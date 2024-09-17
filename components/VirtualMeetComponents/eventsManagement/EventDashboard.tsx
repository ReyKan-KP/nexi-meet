"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Line } from "react-chartjs-2";
import { toast } from "react-toastify";
import { FaChartBar, FaUsers, FaEnvelope, FaFileAlt, FaBars, FaDownload, FaPaperPlane, FaFileExcel, FaFilePdf } from "react-icons/fa";

// Define attendee type
interface Attendee {
  id: number;
  name: string;
  email: string;
  status: string;
}

const EventDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Placeholder data
  const eventStats = {
    totalRegistrations: 500,
    ticketSales: 10000,
    checkIns: 450,
  };

  const registrationData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Registrations",
        data: [65, 59, 80, 81, 56, 55],
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };
  // Define column structure for attendee data
  const columns = useMemo(
    () => [
      { header: "Name", accessor: "name" },
      { header: "Email", accessor: "email" },
      { header: "Status", accessor: "status" },
    ],
    [] // Empty dependency array ensures memoization
  );

  const attendees: Attendee[] = useMemo(
    () => [
      {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
        status: "Registered",
      },
      {
        id: 2,
        name: "Jane Smith",
        email: "jane@example.com",
        status: "Checked In",
      },
    ],
    [] // Empty dependency array ensures memoization
  );

  // Remove react-table related code and replace with a simple sorting state
  const [sortConfig, setSortConfig] = useState<{ key: keyof Attendee; direction: 'asc' | 'desc' } | null>(null);

  // Sort attendees based on the current sort configuration
  const sortedAttendees = useMemo(() => {
    let sortableAttendees = [...attendees];
    if (sortConfig !== null) {
      sortableAttendees.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableAttendees;
  }, [attendees, sortConfig]);

  const requestSort = (key: keyof Attendee) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleExportData = (format: 'excel' | 'pdf') => {
    // Implement export functionality
    toast.success(`Data exported successfully as ${format.toUpperCase()}!`);
  };

  const handleSendNotification = (type: 'email' | 'sms') => {
    // Implement notification sending
    toast.info(`${type.toUpperCase()} notification sent to attendees`);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <h2 className="text-2xl font-bold mb-4">Event Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {Object.entries(eventStats).map(([key, value]) => (
                <div key={key} className="bg-white rounded-lg shadow p-4">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">{key}</h3>
                  <p className="text-3xl font-bold text-gray-900">{value}</p>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">Registration Trend</h3>
              <Line data={registrationData} />
            </div>
          </motion.div>
        );
      case "attendees":
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <h2 className="text-2xl font-bold mb-4">Manage Attendees</h2>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    {['name', 'email', 'status'].map((key) => (
                      <th
                        key={key}
                        onClick={() => requestSort(key as keyof Attendee)}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      >
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                        {sortConfig?.key === key && (
                          <span>{sortConfig.direction === 'asc' ? ' 🔼' : ' 🔽'}</span>
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedAttendees.map((attendee) => (
                    <tr key={attendee.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">{attendee.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{attendee.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{attendee.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        );
      case "communication":
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <h2 className="text-2xl font-bold mb-4">Communication Tools</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => handleSendNotification('email')}
                className="flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
              >
                <FaPaperPlane className="mr-2" />
                Send Email to All Attendees
              </button>
              <button
                onClick={() => handleSendNotification('sms')}
                className="flex items-center justify-center bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
              >
                <FaPaperPlane className="mr-2" />
                Send SMS to All Attendees
              </button>
            </div>
          </motion.div>
        );
      case "reports":
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <h2 className="text-2xl font-bold mb-4">Reports and Downloads</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => handleExportData('excel')}
                className="flex items-center justify-center bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
              >
                <FaFileExcel className="mr-2" />
                Export as Excel
              </button>
              <button
                onClick={() => handleExportData('pdf')}
                className="flex items-center justify-center bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
              >
                <FaFilePdf className="mr-2" />
                Export as PDF
              </button>
            </div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <motion.aside
        initial={{ width: 0 }}
        animate={{ width: sidebarOpen ? "240px" : "0px" }}
        className="bg-white shadow-md"
      >
        <nav className="p-4">
          <ul className="space-y-2">
            {[
              { icon: FaChartBar, text: "Overview", tab: "overview" },
              { icon: FaUsers, text: "Attendees", tab: "attendees" },
              { icon: FaEnvelope, text: "Communication", tab: "communication" },
              { icon: FaFileAlt, text: "Reports", tab: "reports" },
            ].map(({ icon: Icon, text, tab }) => (
              <li key={tab}>
                <button
                  onClick={() => setActiveTab(tab)}
                  className={`flex items-center space-x-2 w-full p-2 rounded ${
                    activeTab === tab ? "bg-teal-500 text-white" : "hover:bg-gray-100"
                  }`}
                >
                  <Icon />
                  <span>{text}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </motion.aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white shadow-sm z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-500 hover:text-gray-600 lg:hidden"
            >
              <FaBars size={24} />
            </button>
            <h1 className="text-2xl font-semibold text-gray-900">Event Dashboard</h1>
            <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded">
              Create New Event
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Render tab content */}
            <div className="mt-8">{renderTabContent()}</div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EventDashboard;
