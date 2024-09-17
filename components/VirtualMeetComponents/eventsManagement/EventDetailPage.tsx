"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import dynamic from "next/dynamic";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { X } from "lucide-react"; // Import the X icon from lucide-react
import { Map } from "@/components/Map";

gsap.registerPlugin(ScrollTrigger);

// const Map = dynamic(() => import("@/components/Map"), { ssr: false });
const RichTextEditor = dynamic(() => import("@/components/RichTextEditor"), { ssr: false });

const EventCard: React.FC<{ event: any; onClick: () => void }> = ({ event, onClick }) => (
  <motion.div
    className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer"
    whileHover={{ scale: 1.05 }}
    onClick={onClick}
  >
    <Image src={event.banner} alt={event.name} width={300} height={200} objectFit="cover" />
    <div className="p-4">
      <h3 className="text-xl font-bold mb-2">{event.name}</h3>
      <p className="text-gray-600 mb-2">{event.date}</p>
      <p className="text-gray-500 mb-2">{event.location}</p>
      <p className="text-sm text-blue-500">#{event.category}</p>
    </div>
  </motion.div>
);

const EventModal: React.FC<{ event: any; onClose: () => void }> = ({ event, onClose }) => {
  const bannerRef = useRef<HTMLDivElement>(null);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showVirtualLink, setShowVirtualLink] = useState(false);

  useEffect(() => {
    if (bannerRef.current) {
      gsap.to(bannerRef.current, {
        scale: 1.05,
        scrollTrigger: {
          trigger: bannerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }
  }, []);

  const handleRegister = () => {
    setShowRegistrationModal(true);
  };

  const handleRegistrationSubmit = (userDetails: any) => {
    setShowRegistrationModal(false);
    if (event.ticketType === 'paid') {
      setShowPaymentModal(true);
    } else {
      setShowVirtualLink(true);
    }
  };

  const handlePaymentComplete = () => {
    setShowPaymentModal(false);
    setShowVirtualLink(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors duration-200"
        >
          <motion.div
            whileHover={{ rotate: 90 }}
            transition={{ duration: 0.2 }}
          >
            <X size={24} />
          </motion.div>
        </button>

        <div className="relative">
          <motion.div
            ref={bannerRef}
            className="relative h-[40vh] overflow-hidden"
          >
            <Image
              src={event.banner}
              alt={event.name}
              layout="fill"
              objectFit="cover"
              objectPosition="center"
            />
            <div className="absolute inset-0 flex flex-col justify-center items-center bg-black bg-opacity-40 text-white">
              <h1 className="text-4xl font-bold mb-2 text-shadow-lg">{event.name}</h1>
              <h2 className="text-2xl text-shadow-md">{event.date} | {event.time}</h2>
            </div>
          </motion.div>

          <div className="p-8">
            <div className="flex flex-col md:flex-row gap-12">
              <div className="md:w-2/3">
                {/* Event Overview */}
                <motion.div
                  className="mb-8 bg-white rounded-lg shadow-md p-6"
                  initial={{ x: -100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <h2 className="text-3xl font-bold mb-4">Event Overview</h2>
                  <p className="mb-2"><strong>Start:</strong> {event.startDate} at {event.startTime}</p>
                  <p className="mb-2"><strong>End:</strong> {event.endDate} at {event.endTime}</p>
                  <p className="mb-2"><strong>Location:</strong> {event.location}</p>
                  <p className="mb-2"><strong>Category:</strong> <span className="text-blue-500">#{event.category}</span></p>
                  <div className="text-gray-600" dangerouslySetInnerHTML={{ __html: event.description }} />
                </motion.div>

                {/* Agenda */}
                <motion.div
                  className="mb-8"
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <h2 className="text-3xl font-bold mb-4">Agenda</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {event.agenda.map((item:any, index:any) => (
                      <motion.div
                        key={index}
                        className="p-4 bg-gradient-to-r from-teal-400 to-green-300 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                        whileHover={{ scale: 1.05 }}
                      >
                        <p className="font-bold text-white">{item.time}</p>
                        <p className="text-lg text-white">{item.title}</p>
                        <p className="text-gray-100">{item.speaker}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Sponsors */}
                <motion.div
                  className="mb-8"
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <h2 className="text-3xl font-bold mb-4">Sponsors</h2>
                  <div className="flex flex-wrap justify-center gap-8">
                    {event.sponsors.map((sponsor:any, index:any) => (
                      <motion.div
                        key={index}
                        whileHover={{ scale: 1.1 }}
                      >
                        <Image
                          src={sponsor}
                          alt={`Sponsor ${index + 1}`}
                          width={120}
                          height={60}
                          className="object-contain filter grayscale hover:filter-none transition-all duration-300"
                        />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>

              <div className="md:w-1/3">
                {/* Register Now button */}
                <motion.button
                  className="w-full bg-teal-500 text-white uppercase text-lg py-4 px-6 rounded-lg mb-8 hover:bg-teal-600 transition-colors duration-300 shadow-md"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowRegistrationModal(true)}
                >
                  Register Here
                </motion.button>

                {/* Organizer */}
                <motion.div
                  className="mb-8 bg-white rounded-lg shadow-md p-6"
                  initial={{ x: 100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <h2 className="text-2xl font-bold mb-4">Organizer</h2>
                  <div className="flex items-center">
                    <Image
                      src={event.organizer.image}
                      alt={event.organizer.name}
                      width={80}
                      height={80}
                      className="rounded-full mr-4"
                    />
                    <p className="text-lg font-semibold">{event.organizer.name}</p>
                  </div>
                </motion.div>

                {/* Location */}
                <div className="mb-8 bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-2xl font-bold mb-4">Location</h2>
                  {event.locationType === "virtual" ? (
                    <div>
                      <span className="inline-block px-3 py-1 bg-blue-500 text-white text-sm rounded-full">Virtual Event</span>
                      <p className="mt-2">This is a virtual event. You will receive the link after registration.</p>
                    </div>
                  ) : (
                    <>
                      <div className="h-64 rounded-lg overflow-hidden">
                        <Map />
                      </div>
                      <p className="mt-2">{event.location}</p>
                    </>
                  )}
                </div>

                {/* Share buttons */}
                <div className="flex justify-center space-x-4">
                  {/* Add your social media share buttons here */}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Registration Modal */}
        <AnimatePresence>
          {showRegistrationModal && (
            <RegistrationModal
              onClose={() => setShowRegistrationModal(false)}
              onSubmit={handleRegistrationSubmit}
            />
          )}
        </AnimatePresence>

        {/* Payment Modal */}
        <AnimatePresence>
          {showPaymentModal && (
            <PaymentModal
              onClose={() => setShowPaymentModal(false)}
              onComplete={handlePaymentComplete}
            />
          )}
        </AnimatePresence>

        {/* Virtual Link Modal */}
        <AnimatePresence>
          {showVirtualLink && (
            <VirtualLinkModal
              link={event.virtualLink}
              onClose={() => setShowVirtualLink(false)}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

const EventDetailPage: React.FC = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events');
        if (response.ok) {
          const data = await response.json();
          setEvents(data);
        } else {
          console.error('Failed to fetch events');
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Upcoming Events</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {events.map((event) => (
          <EventCard
            key={event._id}
            event={{
              ...event,
              name: event.eventName,
              date: `${new Date(
                event.startDate
              ).toLocaleDateString()} - ${new Date(
                event.endDate
              ).toLocaleDateString()}`,
              location:
                event.locationType === "virtual"
                  ? "Virtual"
                  : event.physicalAddress,
              banner: event.bannerUrl,
              category: event.eventCategory,
            }}
            onClick={() => setSelectedEvent(event)}
          />
        ))}
      </div>
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
            }}
            onClose={() => setSelectedEvent(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const RegistrationModal: React.FC<{ onClose: () => void; onSubmit: (userDetails: any) => void }> = ({ onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, email });
  };

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
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors duration-200"
        >
          <motion.div
            whileHover={{ rotate: 90 }}
            transition={{ duration: 0.2 }}
          >
            <X size={24} />
          </motion.div>
        </button>

        <h2 className="text-2xl font-bold mb-4">Registration</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block mb-2">Name:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block mb-2">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="flex justify-end">
            <button type="button" onClick={onClose} className="mr-2 px-4 py-2 bg-gray-200 rounded">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">Submit</button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

const PaymentModal: React.FC<{ onClose: () => void; onComplete: () => void }> = ({ onClose, onComplete }) => {
  const [cardNumber, setCardNumber] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete();
  };

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
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors duration-200"
        >
          <motion.div
            whileHover={{ rotate: 90 }}
            transition={{ duration: 0.2 }}
          >
            <X size={24} />
          </motion.div>
        </button>

        <h2 className="text-2xl font-bold mb-4">Dummy Payment</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="cardNumber" className="block mb-2">Card Number:</label>
            <input
              type="text"
              id="cardNumber"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="flex justify-end">
            <button type="button" onClick={onClose} className="mr-2 px-4 py-2 bg-gray-200 rounded">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">Complete Payment</button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

const VirtualLinkModal: React.FC<{ link: string; onClose: () => void }> = ({ link, onClose }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors duration-200"
        >
          <motion.div
            whileHover={{ rotate: 90 }}
            transition={{ duration: 0.2 }}
          >
            <X size={24} />
          </motion.div>
        </button>

        <h2 className="text-2xl font-bold mb-4">Virtual Event Link</h2>
        <p className="mb-4">Here&apos;s your virtual event link:</p>
        <div className="flex items-center mb-4">
          <input
            type="text"
            value={link}
            readOnly
            className="flex-grow p-2 border rounded-l"
          />
          <button
            onClick={handleCopy}
            className="px-4 py-2 bg-blue-500 text-white rounded-r hover:bg-blue-600 transition-colors duration-200"
          >
            {copied ? 'Copied!' : 'Copy Link'}
          </button>
        </div>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors duration-200"
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default EventDetailPage;
