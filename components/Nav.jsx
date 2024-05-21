"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const Nav = () => {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(true);
  const [toggleDropdown, setToggleDropdown] = useState(false);
  const [isSolutionsDropdownOpen, setIsSolutionsDropdownOpen] = useState(false);

  return (
    <nav className="flex items-center justify-between p-4 w-full bg-transparent">
      <Link href="/" className="flex items-center">
        <Image
          src="/images/logoWithText.png"
          alt="logo"
          width={150}
          height={30}
          className="object-contain"
        />
      </Link>

      <div className="flex items-center space-x-4">
        <Link
          href="/about-us"
          className="text-black text-lg no-underline hover:text-blue-500"
        >
          About Us
        </Link>

        <div
          className="relative"
          onMouseEnter={() => setIsSolutionsDropdownOpen(true)}
          onMouseLeave={() => setIsSolutionsDropdownOpen(false)}
        >
          <div className="flex items-center cursor-pointer">
            <span className="text-black text-lg no-underline hover:text-blue-500 flex items-center">
              Solutions
              <svg
                className="ml-1 w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            </span>
          </div>
          {isSolutionsDropdownOpen && (
            <div
              className="absolute left-0 mt-2 bg-white shadow-lg rounded-lg w-48"
              onMouseEnter={() => setIsSolutionsDropdownOpen(true)}
              onMouseLeave={() => setIsSolutionsDropdownOpen(false)}
            >
              <Link
                href="#"
                className="block px-4 py-2 text-black no-underline hover:bg-gray-200"
              >
                Trade Shows
              </Link>
              <Link
                href="#"
                className="block px-4 py-2 text-black no-underline hover:bg-gray-200"
              >
                Events Marketing
              </Link>
              <Link
                href="#"
                className="block px-4 py-2 text-black no-underline hover:bg-gray-200"
              >
                Networking
              </Link>
              <Link
                href="#"
                className="block px-4 py-2 text-black no-underline hover:bg-gray-200"
              >
                Career Fairs
              </Link>
              <Link
                href="#"
                className="block px-4 py-2 text-black no-underline hover:bg-gray-200"
              >
                Recruiting Sessions
              </Link>
              <Link
                href="#"
                className="block px-4 py-2 text-black no-underline hover:bg-gray-200"
              >
                Event Production
              </Link>
            </div>
          )}
        </div>

        <Link
          href="#"
          className="text-black text-lg no-underline hover:text-blue-500"
        >
          Features
        </Link>
        <Link
          href="#"
          className="text-black text-lg no-underline hover:text-blue-500"
        >
          Pricing
        </Link>
        <Link
          href="#"
          className="text-black text-lg no-underline hover:text-blue-500"
        >
          Blog
        </Link>

        <button className="px-4 py-2 border border-gray-300 rounded text-black hover:text-blue-500">
          Request quote
        </button>
        <button className="px-4 py-2 bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded">
          Meet an Event Planner
        </button>
      </div>
    </nav>
  );
};

export default Nav;
