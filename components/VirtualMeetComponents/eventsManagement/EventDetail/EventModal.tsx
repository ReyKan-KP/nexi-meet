"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import dynamic from "next/dynamic";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { X, Trash2, Calendar, MapPin, User, Share2 } from "lucide-react";
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

gsap.registerPlugin(ScrollTrigger);

import RegistrationModal from "@components/VirtualMeetComponents/eventsManagement/EventDetail/RegistrationModal";
import VirtualLinkModal from "@components/VirtualMeetComponents/eventsManagement/EventDetail/VirtualLinkModal";
import PaymentModal from "@components/VirtualMeetComponents/eventsManagement/EventDetail/PaymentModal";

const EventModal: React.FC<{ event: any; onClose: () => void }> = ({
  event,
  onClose,
}) => {
  // const bannerRef = useRef<HTMLDivElement>(null)
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showVirtualLink, setShowVirtualLink] = useState(false);
  const { data: session } = useSession();
  const [isSmallDevice, setIsSmallDevice] = useState(false);
  const [isMediumDevice, setIsMediumDevice] = useState(false);
  const [hasRegistered, setHasRegistered] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallDevice(window.innerWidth <= 640);
      setIsMediumDevice(window.innerWidth > 640 && window.innerWidth <= 1024);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // useEffect(() => {
  //   if (bannerRef.current) {
  //     const parallax = (e: MouseEvent) => {
  //       const speed = 5
  //       const x = (window.innerWidth - e.pageX * speed) / 100
  //       const y = (window.innerHeight - e.pageY * speed) / 100
  //       bannerRef.current!.style.transform = `translateX(${x}px) translateY(${y}px)`
  //     }
  //     document.addEventListener('mousemove', parallax)
  //     return () => document.removeEventListener('mousemove', parallax)
  //   }
  // }, [])

  const handleRegister = () => {
    setShowRegistrationModal(true);
  };

  const handleRegistrationSubmit = (userDetails: any) => {
    setShowRegistrationModal(false);
    console.log("Ticket Type:", event.ticketType);
    if (event.ticketType === "paid") {
      setShowPaymentModal(true);
    } else {
      setShowVirtualLink(true);
    }
  };

  const handlePaymentComplete = () => {
    setShowPaymentModal(false);
    setShowVirtualLink(true);
  };

  useEffect(() => {
    const checkRegistration = async () => {
      try {
        if (session?.user?.email) {
          console.log("Session email:", session.user.email);
          const response = await fetch(`/api/events/registration`);

          if (response.ok) {
            const data = await response.json();
            console.log("All registration data from API:", data.registrations);
            const userRegistered = data.registrations.some(
              (registration: any) =>
                registration.email === session.user.email &&
                registration.idOfEvent === event._id
            );

            // console.log("User registered:", userRegistered);
            setHasRegistered(userRegistered);
          } else {
            console.error("Failed to fetch registrations");
          }
        }
      } catch (error) {
        console.error("Error fetching registration data:", error);
      }
    };

    checkRegistration();
  }, [event._id, session]);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        className="bg-gradient-to-br from-teal-50 to-blue-50 rounded-lg w-full max-w-6xl max-h-[90vh] overflow-y-auto relative shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 z-10"
          onClick={onClose}
        >
          <motion.div
            whileHover={{ rotate: 90 }}
            transition={{ duration: 0.2 }}
          >
            <X size={24} color="teal"/>
          </motion.div>
        </Button>

        <div className="relative">
          <motion.div
            // ref={bannerRef}
            className="relative h-[40vh] overflow-hidden rounded-t-lg"
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Image
              src={event.banner}
              alt={event.name}
              layout="fill"
              objectFit="cover"
              objectPosition="center"
              className="transition-all duration-300 hover:scale-105"
            />
            <div className="absolute inset-0 flex flex-col justify-center items-center bg-black bg-opacity-40 text-white">
              <motion.h1
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold mb-2 text-shadow-lg"
              >
                {event.name}
              </motion.h1>
              <motion.h2
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-xl md:text-2xl lg:text-3xl text-shadow-md"
              >
                {event.date} | {event.time}
              </motion.h2>
            </div>
          </motion.div>

          <div className="p-8">
            <div
              className={`grid ${
                isSmallDevice
                  ? "grid-cols-1"
                  : isMediumDevice
                  ? "grid-cols-2"
                  : "grid-cols-3"
              } gap-8`}
            >
              <div
                className={`${
                  !isSmallDevice && !isMediumDevice ? "col-span-2" : ""
                }`}
              >
                {/* Event Overview */}
                <Card className="mb-8 overflow-hidden">
                  <CardContent className="p-6">
                    <motion.h2
                      initial={{ x: -50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="text-3xl font-bold mb-4 text-teal-700"
                    >
                      Event Overview
                    </motion.h2>
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      <p className="mb-2 flex items-center">
                        <Calendar className="mr-2 text-teal-500" size={20} />
                        <strong>Start&nbsp;:</strong> &nbsp; {event.startDate}{" "}
                        at {event.startTime}
                      </p>
                      <p className="mb-2 flex items-center">
                        <Calendar className="mr-2 text-teal-500" size={20} />
                        <strong>End : </strong>&nbsp; {event.endDate} at{" "}
                        {event.endTime}
                      </p>
                      <p className="mb-2 flex items-center">
                        <MapPin className="mr-2 text-teal-500" size={20} />
                        <strong>Location :</strong>&nbsp; {event.location}
                      </p>
                      <p className="mb-2">
                        <strong>Category &nbsp; : &nbsp;</strong>{" "}
                        <span className="text-blue-500">#{event.category}</span>
                      </p>
                      <div
                        className="text-gray-600 mt-4"
                        dangerouslySetInnerHTML={{ __html: event.description }}
                      />
                    </motion.div>
                  </CardContent>
                </Card>

                {/* Agenda */}
                <Card className="mb-8 overflow-hidden">
                  <CardContent className="p-6">
                    <motion.h2
                      initial={{ x: -50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.6 }}
                      className="text-3xl font-bold mb-4 text-teal-700"
                    >
                      Agenda
                    </motion.h2>
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.8 }}
                      className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                    >
                      {event.agenda.map((item: any, index: number) => (
                        <motion.div
                          key={index}
                          className="p-4 bg-gradient-to-r from-teal-400 to-blue-300 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                          whileHover={{ scale: 1.05 }}
                        >
                          <p className="font-bold text-white">{item.time}</p>
                          <p className="text-lg text-white">{item.title}</p>
                          <p className="text-gray-100">{item.speaker}</p>
                        </motion.div>
                      ))}
                    </motion.div>
                  </CardContent>
                </Card>

                {/* Sponsors */}
                <Card className="mb-8 overflow-hidden">
                  <CardContent className="p-6">
                    <motion.h2
                      initial={{ x: -50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 1 }}
                      className="text-3xl font-bold mb-4 text-teal-700"
                    >
                      Sponsors
                    </motion.h2>
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 1.2 }}
                      className="flex flex-wrap justify-center gap-8"
                    >
                      {event.sponsors.map((sponsor: string, index: number) => (
                        <motion.div key={index} whileHover={{ scale: 1.1 }}>
                          <Image
                            src={sponsor}
                            alt={`Sponsor ${index + 1}`}
                            width={120}
                            height={60}
                            className="object-contain filter grayscale hover:filter-none transition-all duration-300"
                          />
                        </motion.div>
                      ))}
                    </motion.div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card
                  className={`mb-8 ${
                    !isSmallDevice ? "sticky top-4" : ""
                  } overflow-hidden`}
                >
                  <CardContent className="p-6">
                    {session?.user?.email !== event.userEmail &&
                    !hasRegistered ? (
                      <motion.button
                        className="w-full bg-gradient-to-r from-teal-500 to-blue-500 text-white uppercase text-lg py-4 px-6 rounded-lg mb-8 hover:from-teal-600 hover:to-blue-600 transition-colors duration-300 shadow-md"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          if (!session) {
                            window.location.href = "/sign-in";
                          } else {
                            setShowRegistrationModal(true);
                          }
                        }}
                      >
                        Register Here
                      </motion.button>
                    ) : (
                      <motion.button
                        className="w-full bg-gradient-to-r from-teal-500 to-blue-500 text-white uppercase text-lg py-4 px-6 rounded-lg mb-8 hover:from-teal-600 hover:to-blue-600 transition-colors duration-300 shadow-md"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowVirtualLink(true)}
                      >
                        Link Here
                      </motion.button>
                    )}

                    {/* Organizer */}
                    <motion.div
                      initial={{ x: 50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="mb-8"
                    >
                      <h2 className="text-2xl font-bold mb-4 text-teal-700">
                        Organizer
                      </h2>
                      <div className="flex items-center">
                        <Avatar className="h-12 w-12 mr-4">
                          <AvatarImage
                            src={event.organizer.image}
                            alt={event.organizer.name}
                          />
                          <AvatarFallback>
                            {event.organizer.name
                              .split(" ")
                              .map((n: string) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <p className="text-lg font-semibold">
                          {event.organizer.name}
                        </p>
                      </div>
                    </motion.div>

                    {/* Location */}
                    <motion.div
                      initial={{ x: 50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.6 }}
                      className="mb-8"
                    >
                      <h2 className="text-2xl font-bold mb-4 text-teal-700">
                        Location
                      </h2>
                      {event.locationType === "virtual" ? (
                        <div>
                          <span className="inline-block px-3 py-1 bg-blue-500 text-white text-sm rounded-full">
                            Virtual Event
                          </span>
                          <p className="mt-2">
                            This is a virtual event. You will receive the link
                            after registration.
                          </p>
                        </div>
                      ) : (
                        <>
                          <div className="h-64 rounded-lg overflow-hidden mb-2">
                            <Image
                              src="/placeholder-map.jpg"
                              alt="Event location"
                              layout="fill"
                              objectFit="cover"
                            />
                          </div>
                          <p>{event.location}</p>
                        </>
                      )}
                    </motion.div>

                    {/* Share buttons */}
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.8 }}
                      className="flex justify-center space-x-4"
                    >
                      <Button variant="outline" size="icon">
                        <Share2 size={20} />
                      </Button>
                      {/* Add more social media share buttons here */}
                    </motion.div>
                  </CardContent>
                </Card>
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
              eventId={event._id}
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

export default EventModal;