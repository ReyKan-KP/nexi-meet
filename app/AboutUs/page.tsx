"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaLinkedin, FaGithub } from "react-icons/fa";
// import { ChevronRightIcon } from "@heroicons/react/24/solid";

// Hero Section Component
import { useSession } from "next-auth/react"; // Add this import

const HeroSection = () => {
  const { data: session } = useSession(); // Add this line to get the session

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="relative h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-teal-100 p-10 lg:p-20"
    >
      <div className="text-center space-y-6">
        <h1 className="font-semibold text-4xl lg:text-5xl text-teal-600">
          Host, Connect, and Engage Like Never Before
        </h1>
        <p className="text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto">
          Unlock the power of interactive virtual events with NexiMeet&apos;s
          cutting-edge platform.
              </p>
              <br />
        <Link href={session ? "/virtualMeetHome" : "/sign-up"} passHref>
          <motion.button
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="bg-teal-600 text-white px-8 py-3 rounded-full font-medium hover:bg-teal-700 transition duration-300"
          >
            {session ? "Get Started" : "Join for free"}
          </motion.button>
        </Link>
        {!session && (
          <p className="text-gray-600">
            Already a member?{" "}
            <Link href="/sign-in">
              <span className="text-teal-600 underline">Log in</span>
            </Link>
          </p>
        )}
      </div>
    </motion.section>
  );
};

// Our Story Section Component
const OurStorySection = () => {
  const timelineEvents = [
    { year: 2024, title: "NexiMeet Launched", icon: "🚀" },
  ];

  return (
    <section className="py-10 lg:py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div>
            <h2 className="text-3xl font-semibold text-gray-800 mb-6">
              Our Story
            </h2>
            <div className="space-y-6">
              <p className="text-base lg:text-lg text-gray-600">
                NexiMeet started as my personal project in 2023 with a simple
                idea: to make virtual events as engaging and impactful as
                in-person ones. The journey has been filled with innovation,
                challenges, and groundbreaking solutions.
              </p>
              <p className="text-base lg:text-lg text-gray-600">
                Today, I am proud to be at the forefront of the virtual event
                industry, constantly pushing the boundaries of what&apos;s
                possible in online gatherings.
              </p>
            </div>
          </div>
          <div className="relative">
            {timelineEvents.map((event, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="flex items-center mb-8"
              >
                <div className="bg-teal-500 rounded-full p-3 mr-4">
                  <span className="text-2xl">{event.icon}</span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">{event.year}</p>
                  <h3 className="text-lg font-medium">{event.title}</h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// Team Member Card Component
const TeamMemberCard = ({ name, role, image }: { name: string; role: string; image: string }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <motion.div
      className="bg-white rounded-lg shadow-lg overflow-hidden"
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        className="relative w-full h-full"
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="p-6 lg:p-8">
          <Image
            src={image}
            alt={name}
            width={200}
            height={200}
            className="rounded-full mx-auto mb-4"
          />
          <h3 className="text-lg font-medium text-center">{name}</h3>
          <p className="text-sm text-gray-500 text-center">{role}</p>
        </div>
        <motion.div
          className="absolute top-0 left-0 w-full h-full bg-teal-600 p-6 lg:p-8 flex flex-col justify-center items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: isFlipped ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <p className="text-white text-center mb-4">Connect with {name}</p>
          <div className="flex space-x-4">
            <FaLinkedin className="text-white text-2xl cursor-pointer" />
            <FaGithub className="text-white text-2xl cursor-pointer" />
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

// Team Section Component
const TeamSection = () => {
  const teamMembers = [
    {
      name: "Kanishaka Pranjal",
    //   role: "CEO",
      image: "/images/team/alice.jpg",
      linkedin: "https://www.linkedin.com/in/kanishaka-pranjal-070a45235/",
      github: "https://github.com/ReyKan-KP",
    },
    // {
    //   name: "Bob Smith",
    //   role: "CTO",
    //   image: "/images/team/bob.jpg",
    //   linkedin: "https://linkedin.com/in/bobsmith",
    //   github: "https://github.com/bobsmith",
    // },
    // Add more team members as needed
  ];

  return (
    <section className="px-10 lg:px-20 ">
      <h2 className="text-3xl font-semibold text-gray-800 mb-8 text-center">
        Our Team
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teamMembers.map((member, index) => (
          <div key={index} className="relative group">
            <div className="bg-white shadow-lg p-6 lg:p-8 rounded-lg">
              <div className="text-center">
                <Image
                  src={member.image}
                  alt={member.name}
                  width={150}
                  height={150}
                  className="rounded-full mx-auto"
                />
                <h3 className="text-lg font-medium mt-4">{member.name}</h3>
                {/* <p className="text-sm text-gray-500">{member.role}</p> */}
              </div>
            </div>
            <motion.div
              className="absolute top-0 left-0 w-full h-full bg-teal-600 text-white rounded-lg flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <p className="mb-4">Get in touch with {member.name}</p>
              <div className="flex space-x-4">
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaLinkedin size={24} />
                </a>
                <a
                  href={member.github}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaGithub size={24} />
                </a>
              </div>
            </motion.div>
          </div>
        ))}
          </div>
          <br />
    </section>
  );
};

// CTA Section Component
const CTASection = () => (
  <motion.section
    initial={{ opacity: 0, x: 100 }}
    whileInView={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.8 }}
    className="bg-teal-600 py-16 px-10"
  >
    <div className="container mx-auto text-center">
      <h2 className="text-3xl font-bold text-white mb-6">Join Our Journey</h2>
      <div className="space-x-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          className="bg-white text-teal-600 px-8 py-3 rounded-full font-medium hover:bg-gray-100 transition duration-300"
        >
          Contact Us
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          className="bg-transparent text-white border-2 border-white px-8 py-3 rounded-full font-medium hover:bg-white hover:text-teal-600 transition duration-300"
        >
          Explore NexiMeet
        </motion.button>
      </div>
    </div>
  </motion.section>
);

// Main About Us Component
export default function AboutUs() {
  return (
    <div className="font-sans">
      <HeroSection />
      <OurStorySection />
      <TeamSection />
      <CTASection />
    </div>
  );
}
