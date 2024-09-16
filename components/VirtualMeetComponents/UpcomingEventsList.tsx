import React from "react";
import Link from "next/link";

// This is a placeholder component. You'll need to implement the actual logic to fetch and display upcoming events.
const UpcomingEventsList = () => {
  const placeholderEvents = [
    { id: 1, title: "Team Meeting", date: "2023-04-15", time: "14:00" },
    { id: 2, title: "Project Review", date: "2023-04-16", time: "10:30" },
    { id: 3, title: "Client Presentation", date: "2023-04-17", time: "15:45" },
  ];

  return (
    <div className="overflow-x-auto">
      <div className="flex space-x-4 pb-4">
        {placeholderEvents.map((event) => (
          <div
            key={event.id}
            className="flex-shrink-0 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4"
          >
            <h3 className="font-semibold text-lg mb-2">{event.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {event.date} at {event.time}
            </p>
            <Link
              href={`/meeting/${event.id}`}
              className="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Join
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingEventsList;
