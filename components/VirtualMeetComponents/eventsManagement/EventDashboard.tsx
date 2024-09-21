"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUsers,
  FaArrowUp,
  FaDollarSign,
  FaClock,
  FaCalendarAlt,
  FaSearch,
  FaFilter,
  FaMapMarkerAlt,
  FaSortAmountDown,
  FaTrashAlt,
} from "react-icons/fa";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
import Image from "next/image";
// Types
type EventStatus = "Upcoming" | "Live" | "Ended";

interface Event {
  eventName: string;
  eventCategory: string;
  id: string;
  startDate: string;
  endDate: string;
  status: EventStatus;
  description: string;
  organizer: {
    name: string;
    imageUrl: string;
  };
  bannerUrl: string;
  locationType: "virtual" | "physical";
  physicalAddress?: string;
  virtualLink?: string;
}

interface EventStatistics {
  eventId: string;
  views: number;
  rsvps: number;
  averageTimeSpent: number;
  conversionRate: number;
}

interface Registration {
  id: string;
  eventId: string;
  name: string;
  email: string;
  registrationDate: string;
}

const eventStatistics: { [key: string]: EventStatistics } = {
  "66e9caeff9264d106aad127f": {
    eventId: "66e9caeff9264d106aad127f",
    views: 3,
    rsvps: 5,
    averageTimeSpent: 10.323,
    conversionRate: 250,
  },
  "66ed508471525102284814": {
    eventId: "66ed508471525102284814",
    views: 2,
    rsvps: 4,
    averageTimeSpent: 2.02,
    conversionRate: 400,
  },
};

const registrations: Registration[] = [
  {
    id: "66ed8998f14156c2702b502b",
    eventId: "66e9bc94b7113dd489a722f8",
    name: "Kanishak Pranjal",
    email: "kanishakpranjal@gmail.com",
    registrationDate: "2024-09-20T14:41:28.118+00:00",
  },
  {
    id: "66ed8a3bf14156c2702b502d",
    eventId: "66e9bc94b7113dd489a722f8",
    name: "Kanishak Pranjal",
    email: "kanishakpranjal@gmail.com",
    registrationDate: "2024-09-20T14:44:11.069+00:00",
  },
  {
    id: "66ed8db4f14156c2702b506a",
    eventId: "66e9c44c47a6cad5a5ee354c",
    name: "Kanishak Pranjal",
    email: "kanishakpranjal@gmail.com",
    registrationDate: "2024-09-20T14:59:00.642+00:00",
  },
];

export default function EventDashboard() {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [eventStatistics, setEventStatistics] = useState<{
    [key: string]: EventStatistics;
  }>({});

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("/api/events");
        if (response.ok) {
          const data = await response.json();
          setEvents(data);
        } else {
          console.error("Failed to fetch events");
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchEvents();
  }, []);
  const fetchEventStatistics = async (eventId: string) => {
    try {
      const response = await fetch(
        `/api/events/userEngagement?eventId=${eventId}`
      );
      if (response.ok) {
        const data = await response.json();
        setEventStatistics(data);
      } else {
        console.error("Failed to fetch event statistics");
      }
    } catch (error) {
      console.error("Error fetching event statistics:", error);
    }
  };

  useEffect(() => {
    if (selectedEvent) {
      fetchEventStatistics(selectedEvent.id);
    }
  }, [selectedEvent]);
  const getEventStatistics = (eventId: string) => {
    return (
      eventStatistics[eventId] || {
        eventId,
        views: 0,
        rsvps: 0,
        averageTimeSpent: 0,
        conversionRate: 0,
      }
    );
  };

  const getEventRegistrations = (eventId: string) => {
    return registrations.filter((reg) => reg.eventId === eventId);
  };

  const getChartData = (eventId: string) => {
    return {
      labels: ["January", "February", "March", "April", "May", "June", "July"],
      datasets: [
        {
          label: "Event Registrations",
          data: [65, 59, 80, 81, 56, 55, 40],
          fill: false,
          borderColor: "rgb(75, 192, 192)",
          tension: 0.1,
        },
      ],
    };
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Event Dashboard</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <motion.div
              key={event.id}
              className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer"
              whileHover={{ scale: 1.03 }}
              onClick={() => setSelectedEvent(event)}
            >
              <Image
                src={event.bannerUrl}
                alt={event.eventName}
                className="w-full h-48 object-cover"
                width={0}
                height={0}
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">
                  {event.eventName}
                </h3>
                <p className="text-gray-600 mb-2">{event.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    {new Date(event.startDate).toLocaleDateString()}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      event.locationType === "virtual"
                        ? "bg-green-200 text-green-800"
                        : event.locationType === "physical"
                        ? "bg-yellow-200 text-yellow-800"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    {event.locationType}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {selectedEvent && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto"
              onClick={() => setSelectedEvent(null)}
            >
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
                className="bg-white p-8 rounded-lg max-w-7xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className="text-3xl font-bold mb-6">
                  {selectedEvent.eventName} Dashboard
                </h2>

                {/* Statistics Section */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                  {Object.entries(getEventStatistics(selectedEvent.id)).map(
                    ([key, value], index) => {
                      if (key === "eventId") return null;
                      const gradients = [
                        "bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800",
                        "bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900 dark:to-purple-800",
                        "bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-900 dark:to-yellow-800",
                        "bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900 dark:to-green-800",
                      ];
                      return (
                        <div
                          key={key}
                          className={`overflow-hidden shadow rounded-lg ${
                            gradients[index % gradients.length]
                          }`}
                        >
                          <div className="p-5">
                            <div className="flex items-center">
                              <div className="flex-shrink-0">
                                <FaUsers
                                  className="h-6 w-6 text-gray-400"
                                  aria-hidden="true"
                                />
                              </div>
                              <div className="ml-5 w-0 flex-1">
                                <dl>
                                  <dt className="text-sm font-medium text-gray-500 truncate">
                                    {key.charAt(0).toUpperCase() + key.slice(1)}
                                  </dt>
                                  <dd>
                                    <div className="text-lg font-medium text-gray-900">
                                      {typeof value === "number"
                                        ? value.toFixed(2)
                                        : value}
                                    </div>
                                  </dd>
                                </dl>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>

                {/* Graph Section */}
                <div className="bg-white p-6 rounded-lg shadow mb-8">
                  <h2 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    Event Registration Trends
                  </h2>
                  <Line data={getChartData(selectedEvent.id)} />
                </div>

                {/* Event Details Section */}
                <div className="bg-white p-6 rounded-lg shadow mb-8">
                  <h2 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    Event Details
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold">Start Date</h3>
                      <p>
                        {new Date(selectedEvent.startDate).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold">End Date</h3>
                      <p>{new Date(selectedEvent.endDate).toLocaleString()}</p>
                    </div>
                    {/* <div>
                      <h3 className="font-semibold">Status</h3>
                      <p>{selectedEvent.status}</p>
                    </div> */}
                    <div>
                      <h3 className="font-semibold">Category</h3>
                      <p>{selectedEvent.eventCategory}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold">Location Type</h3>
                      <p>{selectedEvent.locationType}</p>
                    </div>
                    {selectedEvent.locationType === "virtual" && (
                      <div>
                        <h3 className="font-semibold">Virtual Link</h3>
                        <a
                          href={selectedEvent.virtualLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Join Event
                        </a>
                      </div>
                    )}
                    {selectedEvent.locationType === "physical" &&
                      selectedEvent.physicalAddress && (
                        <div>
                          <h3 className="font-semibold">Address</h3>
                          <p>{selectedEvent.physicalAddress}</p>
                        </div>
                      )}
                  </div>
                </div>

                {/* Registrations Table */}
                <div className="bg-white p-6 rounded-lg shadow overflow-hidden mb-8">
                  <h2 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    Recent Registrations
                  </h2>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Name
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Email
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Registration Date
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {getEventRegistrations(selectedEvent.id).map(
                          (registration) => (
                            <tr key={registration.id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {registration.name}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {registration.email}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(
                                  registration.registrationDate
                                ).toLocaleString()}
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Action Buttons Section */}
                <div className="flex justify-end space-x-4">
                  <button
                    className="bg-red-600 text-white px-6 py-3 rounded-md hover:bg-red-700 transition-colors"
                    onClick={() => setSelectedEvent(null)}
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
