"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FaTrash } from "react-icons/fa";

gsap.registerPlugin(ScrollTrigger);

const colorGradients = [
  "bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900 dark:to-green-800",
  "bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-900 dark:to-yellow-800",
  "bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900 dark:to-purple-800",
  "bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800",
];

interface Event {
  _id: string;
  bgColor?: string;
  text?: string;
  title?: string;
  date?: string;
  time?: string;
  link?: string;
  // Add other properties as needed
}

const UpcomingEventsList = () => {
  const { data: session } = useSession();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      if (session?.user?.id) {
        try {
          setLoading(true);
          const response = await fetch(`/api/notes?user=${session.user.id}`);
          if (response.ok) {
            const data = await response.json();
            console.log("Fetched data:", data);
            const filteredEvents = data.filter((event: any) => event.link);
            console.log("Filtered events:", filteredEvents);
            setEvents(filteredEvents);
          } else {
            console.error("Failed to fetch events");
            setError("Failed to fetch events" as any);
          }
        } catch (error) {
          console.error("Error fetching events:", error);
          setError("Error fetching events" as any);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchEvents();

    // GSAP animation for smooth scrolling
    gsap.fromTo(
      ".event-card",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, stagger: 0.1, duration: 0.5, ease: "power2.out" }
    );
  }, [session]);

  // console.log("Current events state:", events);
  // console.log("Loading state:", loading);
  // console.log("Error state:", error);

  if (loading) return <div>Loading events...</div>;
  if (error) return <div>Error: {error}</div>;
  if (events.length === 0) return <div>No upcoming events found.</div>;

  // Function to get a random color, ensuring no adjacent duplicates
  const getRandomColor = (index: number, prevColor?: string) => {
    let availableColors = colorGradients.filter(color => color !== prevColor);
    return availableColors[index % availableColors.length];
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/notes/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Animate the deletion
        const card = document.getElementById(`event-${id}`);
        gsap.to(card, {
          opacity: 0,
          scale: 0.8,
          duration: 0.5,
          ease: "power2.in",
          onComplete: () => {
            gsap.to(card, { height: 0, marginBottom: 0, duration: 0.3, ease: "power2.in" });
            setTimeout(() => {
              setEvents(events.filter(event => event._id !== id));
            }, 300);
          }
        });
      } else {
        console.error('Failed to delete event');
      }
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  return (
    <div className="overflow-x-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-[#574476] dark:text-blue-300">
        Upcoming Events
      </h2>
      <div className="event-container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {events.map((event: Event, index: number) => {
          const bgColor = getRandomColor(
            index,
            index > 0 ? events[index - 1]?.bgColor || "" : ""
          );
          event.bgColor = bgColor;
          return (
            <div
              key={event._id || index}
              id={`event-${event._id}`}
              className={`event-card rounded-lg shadow-md p-6 transform hover:scale-105 transition-all duration-300 ease-in-out relative overflow-hidden`}
            >
              <div className={`absolute inset-0 ${bgColor}`} />
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-100 pr-8">
                    {event.text || event.title || `Event ${index + 1}`}
                  </h3>
                  <button
                    onClick={() => handleDelete(event._id)}
                    className="p-1 text-red-500 hover:text-red-700 transition-colors duration-300 absolute top-0 right-0 mt-1 mr-1"
                    aria-label="Delete event"
                  >
                    <FaTrash size={16} />
                  </button>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-200 mb-4">
                  {event.date
                    ? new Date(event.date).toLocaleDateString()
                    : "Date not set"}
                  {event.time ? ` at ${event.time}` : ""}
                </p>
                {event.link && (
                  <Link
                    href={event.link}
                    className="mt-4 inline-block px-6 py-2 bg-white text-gray-800 dark:bg-gray-800 dark:text-white rounded-full hover:bg-opacity-90 dark:hover:bg-opacity-90 transition-colors duration-300 shadow-md hover:shadow-lg"
                  >
                    Join Event
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {events.length === 0 && (
        <div className="text-center text-gray-600 dark:text-gray-400 mt-8">
          No upcoming events found.
        </div>
      )}
    </div>
  );
};

export default UpcomingEventsList;
