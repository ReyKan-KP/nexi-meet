"use client"
import React from "react";
import Image from "next/image";
import Link from "next/link";
import ScrollToTop from "react-scroll-to-top";
import { ChevronUp } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-100 py-10 w-full">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center mb-6 md:mb-0 cursor-pointer">
          <Link href="/">
            <Image
              src="/images/logoWithText.png"
              alt="NexiMeet Logo"
              width={200}
              height={200}
            />
          </Link>
        </div>
        <div className="flex flex-col md:flex-row text-gray-700">
          <div className="mb-6 md:mb-0 md:mr-8">
            <Link href="/Contact">
              <h5 className="font-bold mb-2 hover:text-blue-400">Contact Us</h5>
            </Link>
            <ul>
              <li className="mb-2">
                <Link href="/AboutUs">
                  <span className="hover:text-blue-400">About Us</span>
                </Link>
              </li>
              {/* <li className="mb-2">
                <Link href="#">
                  <span className="hover:text-blue-400">Careers</span>
                </Link>
              </li> */}
              <li className="mb-2">
                <Link href="/Events">
                  <span className="hover:text-blue-400">Blog</span>
                </Link>
              </li>
              <li>
                <Link href="/virtualMeetHome">
                  <span className="hover:text-blue-400">
                    Meet an Event Planner
                  </span>
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold mb-2 hover:text-blue-400">Support</h5>
            <ul>
              <li className="mb-2">
                <Link href="#">
                  <span className="hover:text-blue-400">Help Center</span>
                </Link>
              </li>
              <li className="mb-2">
                <Link href="#">
                  <span className="hover:text-blue-400">Privacy Policy</span>
                </Link>
              </li>
              <li className="mb-2">
                <Link href="#">
                  <span className="hover:text-blue-400">
                    Terms and Conditions
                  </span>
                </Link>
              </li>
              {/* <li>
                <Link href="#">
                  <span className="hover:text-blue-400">
                    Event Manager Portal
                  </span>
                </Link>
              </li> */}
            </ul>
          </div>
        </div>
      </div>
      <ScrollToTop
        smooth
        top={50}
        component={<ChevronUp size={24} color="white" />}
        style={{
          right: "20px",
          bottom: "20px",
          borderRadius: "50%",
          backgroundColor: "#007BFF",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          border: "none",
          width: "50px",
          height: "50px",
          zIndex: 1000,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      />
    </footer>
  );
};

export default Footer;
