"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MeetingTypeList from "@components/VirtualMeetComponents/MeetingTypeList";
import UpcomingEventsList from "@components/VirtualMeetComponents/UpcomingEventsList";
import EventCreationPage from "@/components/VirtualMeetComponents/eventsManagement/EventCreationPage";
import EventDetailPage from "@/components/VirtualMeetComponents/eventsManagement/EventDetail/EventDetailPage";

import EventDashboard from "@/components/VirtualMeetComponents/eventsManagement/EventDashboard";
import PersonalRoom from "./personal-room/page";
// import UpcomingPage from "./upcoming-events/page";
import PreviousPage from "./previous-events/page";

const VirtualMeetHome = () => {
  const [activeTab, setActiveTab] = useState("home");

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return (
          <section className="flex flex-col gap-10 text-[#574476]">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-2">
                Welcome to NexiMeet - Your Virtual Event Hub
              </h1>
              <p className="text-xl">
                Create, Schedule, Watch, and Join your events seamlessly!
              </p>
            </div>
            <MeetingTypeList />
            <div>
              <UpcomingEventsList />
            </div>
          </section>
        );
      case "create event":
        return <EventCreationPage />;
      case "events detail":
        return <EventDetailPage />;
      case "dashboard":
        return <EventDashboard />;
      case "personal-room":
        return <PersonalRoom />;
      // case "upcoming-events":
      //   return <UpcomingPage />;
      case "previous-events":
        return <PreviousPage />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-sans">
      <nav className="bg-white border-b border-gray-200 py-4 mb-6">
        <ul className="flex justify-center space-x-6 sm:space-x-8">
          {[
            "home",
            "create event",
            "events detail",
            "dashboard",
            "personal-room",
            // "upcoming-events",
            "previous-events",
          ].map((tab) => (
            <motion.li
              key={tab}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <button
                onClick={() => setActiveTab(tab)}
                className={`text-base font-medium ${
                  activeTab === tab
                    ? "text-teal-600"
                    : "text-gray-700 hover:text-teal-600"
                } transition-colors duration-200`}
              >
                {tab.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
              </button>
            </motion.li>
          ))}
        </ul>
      </nav>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default VirtualMeetHome;
