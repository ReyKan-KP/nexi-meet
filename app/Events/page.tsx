"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectContent,
} from "@/components/ui/select";
import {
  Search as SearchIcon,
  Filter as FilterIcon,
  MapPin as LocationIcon
} from "lucide-react";
import { FaSortAmountDown } from "react-icons/fa";

gsap.registerPlugin(ScrollTrigger);

import EventModal from "@components/VirtualMeetComponents/eventsManagement/EventDetail/EventModal";

const EventDetailPage: React.FC = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState<string | null>(null);
  const [filterOption, setFilterOption] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<any | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("/api/events");
        if (response.ok) {
          const data = await response.json();
          setEvents(data);
          setFilteredEvents(data);
        } else {
          console.error("Failed to fetch events");
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchEvents();
  }, []);

  const postUserEngagement = async (
    eventId: string,
    action: string,
    searchTerm?: string,
    timeSpent?: number
  ) => {
    try {
      const body = {
        eventId,
        action,
        searchTerm,
        timeSpent,
      };
      const response = await fetch("/api/events/userEngagement", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        console.error("Failed to log user engagement");
      }
    } catch (error) {
      console.error("Error posting user engagement:", error);
    }
  };

  const handleDelete = async () => {
    if (eventToDelete) {
      try {
        const response = await fetch(`/api/events/${eventToDelete._id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          setEvents(events.filter((event) => event._id !== eventToDelete._id));
          setShowDeleteConfirm(false);
          setEventToDelete(null);
        } else {
          const errorData = await response.json();
          console.error("Failed to delete event:", errorData.error);
        }
      } catch (error) {
        console.error("Error deleting event:", error);
      }
    }
  };

  // Filtering based on event type and location
  useEffect(() => {
    let filtered = events;
    const now = new Date();

    if (filterOption === "upcoming") {
      filtered = events.filter((event) => new Date(event.startDate) > now);
    } else if (filterOption === "ongoing") {
      filtered = events.filter(
        (event) =>
          new Date(event.startDate) <= now && new Date(event.endDate) >= now
      );
    } else if (filterOption === "previous") {
      filtered = events.filter((event) => new Date(event.endDate) < now);
    }

    if (locationFilter !== "all") {
      filtered = filtered.filter(
        (event) => event.locationType === locationFilter
      );
    }

    setFilteredEvents(filtered);
  }, [filterOption, locationFilter, events]);

  // Sorting logic
  const sortEvents = (events: any[]) => {
    if (sortOption === "asc-date") {
      return events.sort(
        (a, b) =>
          new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
      );
    } else if (sortOption === "desc-date") {
      return events.sort(
        (a, b) =>
          new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
      );
    } else if (sortOption === "asc-title") {
      return events.sort((a, b) => a.eventName.localeCompare(b.eventName));
    }
    else if (sortOption === "desc-title") {
      return events.sort((a, b) => b.eventName.localeCompare(a.eventName));
    }
    return events;
  };

  // Search functionality
  useEffect(() => {
    const filtered = events.filter(
      (event) =>
        event.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.eventCategory.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.organizer.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEvents(sortEvents(filtered));
    // if (searchTerm) {
    //   postUserEngagement("all", "search", searchTerm);
    // }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, sortOption, events]);

  const handleEventClick = (event: any) => {
    setSelectedEvent(event);
    postUserEngagement(event._id, "click"); // Record click on card
    postUserEngagement(event._id, "view"); // Record view when modal opens
  };

  const handleRSVP = (eventId: string) => {
    postUserEngagement(eventId, "rsvp");
  };

  // Example of tracking time spent (just a placeholder, you could use timers for more accuracy)
  useEffect(() => {
    const startTime = Date.now();

    return () => {
      const timeSpent = (Date.now() - startTime) / 1000; // Convert to seconds
      if (selectedEvent) {
        postUserEngagement(
          selectedEvent._id,
          "timeSpent",
          undefined,
          timeSpent
        );
      }
    };
  }, [selectedEvent]);


  return (
    <div className="container mx-auto px-4 py-8">
      <center>
        <h1 className="text-4xl font-bold mb-8 text-[#574476]">Events Blog</h1>
      </center>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center mb-6"
      >
        <SearchIcon className="w-5 h-5 text-gray-500" /> &nbsp;&nbsp;
        <Input
          type="text"
          placeholder="Search by title, category, organizer..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mr-2"
        />
        {/* Added Search Icon */}
      </motion.div>

      {/* Filters and Sorts */}
      <motion.div initial={{ y: 20 }} animate={{ y: 0 }}>
        <div className="flex justify-between mb-6">
          {/* Event Type Filter */}
          <Select
            onValueChange={(value) => setFilterOption(value)}
            value={filterOption}
          >
            <SelectTrigger>
              <FilterIcon className="w-5 h-5 text-gray-500 inline-block" />{" "}
              {/* Added Filter Icon */}
              Select Event Type
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Events</SelectItem>
              <SelectItem value="upcoming">Upcoming Events</SelectItem>
              <SelectItem value="ongoing">Ongoing Events</SelectItem>
              <SelectItem value="previous">Previous Events</SelectItem>
            </SelectContent>
          </Select>
          &nbsp;&nbsp;
          {/* Location Filter */}
          <Select
            onValueChange={(value) => setLocationFilter(value)}
            value={locationFilter}
          >
            <SelectTrigger>
              <LocationIcon className="w-5 h-5 text-gray-500 inline-block" />{" "}
              {/* Added Location Icon */}
              Select Location
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="virtual">Virtual</SelectItem>
              <SelectItem value="physical">Physical</SelectItem>
            </SelectContent>
          </Select>
          &nbsp;&nbsp;
          {/* Sort Options */}
          <Select
            onValueChange={(value) => setSortOption(value ?? "")}
            value={sortOption ?? ""}
          >
            <SelectTrigger>
              {/* <SortIcon className="w-5 h-5 text-gray-500 inline-block" />{" "} */}
              {/* Added Sort Icon */}
              <FaSortAmountDown className="w-5 h-5 text-gray-500 inline-block" />
              Sort By
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc-date" className="inline-flex">
                Start Date (Asc)
              </SelectItem>
              <SelectItem value="desc-date">Start Date (Desc)</SelectItem>
              <SelectItem value="asc-title">Title (A-Z)</SelectItem>
              <SelectItem value="desc-title">Title (Z-A)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      {/* Event Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredEvents.map((event) => (
          <motion.div
            key={event._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            whileHover={{ scale: 1.03 }}
          >
            <Card className="h-full flex flex-col overflow-hidden">
              <div className="relative h-48 w-full">
                <Image
                  src={event.bannerUrl}
                  alt={`Banner for ${event.eventName}`}
                  layout="fill"
                  objectFit="contain"
                  className="transition-transform duration-300 ease-in-out transform hover:scale-105"
                  onClick={() => handleEventClick(event)}
                />
                {session?.user?.email === event.userEmail && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      //   setSelectedEvent(event);
                      setEventToDelete(event);
                      setShowDeleteConfirm(true);
                    }}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-200"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">{event.eventName}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-muted-foreground text-sm mb-4">
                  {event.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="secondary" className="text-xs">
                    {event.eventCategory}
                  </Badge>
                </div>
                <div className="flex items-center">
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarImage
                      src={event.organizer.imageUrl}
                      alt={event.organizer.name}
                    />
                    <AvatarFallback>
                      {event.organizer.name
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">
                      {event.organizer.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(event.startDate).toLocaleDateString()} -{" "}
                      {new Date(event.endDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  onClick={() => {
                    setSelectedEvent(event);
                    handleRSVP(event._id);
                  }}
                >
                  View Details
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Event Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <EventModal
            event={{
              ...selectedEvent,
              name: selectedEvent.eventName,
              startDate: new Date(selectedEvent.startDate).toLocaleDateString(),
              endDate: new Date(selectedEvent.endDate).toLocaleDateString(),
              startTime: selectedEvent.startTime,
              endTime: selectedEvent.endTime,
              location:
                selectedEvent.locationType === "virtual"
                  ? "Virtual"
                  : selectedEvent.physicalAddress,
              description: selectedEvent.eventDescription,
              banner: selectedEvent.bannerUrl,
              organizer: {
                name: selectedEvent.organizer.name,
                image: selectedEvent.organizer.imageUrl,
              },
              category: selectedEvent.eventCategory,
              userEmail: selectedEvent.userEmail,
            }}
            onClose={() => {
              setSelectedEvent(null);
              postUserEngagement(selectedEvent._id, "view"); // Record view when modal is closed
            }}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showDeleteConfirm && (
          <DeleteConfirmModal
            onClose={() => {
              setShowDeleteConfirm(false);
              setEventToDelete(null);
            }}
            onConfirm={handleDelete}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
const DeleteConfirmModal: React.FC<{
  onClose: () => void;
  onConfirm: () => void;
}> = ({ onClose, onConfirm }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        className="bg-white p-8 rounded-lg relative"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-4">Confirm Deletion</h2>
        <p className="mb-4">Are you sure you want to delete this event?</p>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="mr-2 px-4 py-2 bg-gray-200 rounded"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded"
          >
            Delete
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default EventDetailPage;
