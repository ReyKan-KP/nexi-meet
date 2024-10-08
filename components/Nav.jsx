//components/Nav.jsx
"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
// import { ModeToggle } from "@components/ui/toggleTheme";

const Nav = () => {
  const { data: session, status } = useSession();
  const [toggleDropdown, setToggleDropdown] = useState(false);
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const sideMenuRef = useRef(null);

  const handleGetStarted = (e) => {
    if (!session) {
      e.preventDefault();
      window.location.href = "/sign-in";
    }
  };

  const handleDropdownClick = () => {
    setToggleDropdown(!toggleDropdown);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setToggleDropdown(false);
    }
    if (sideMenuRef.current && !sideMenuRef.current.contains(event.target)) {
      setIsSideMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const [userImage, setUserImage] = useState("/images/user1.png");
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      const userId = session?.user?.id;

      const fetchUserProfile = async () => {
        try {
          const response = await fetch(`/api/updateProfile?id=${userId}`);
          if (!response.ok) {
            throw new Error("Failed to fetch user profile");
          }
          const data = await response.json();
          setUserImage(data.image);
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      };

      fetchUserProfile();
    }
  }, [status, session]);

  const handleSideMenuToggle = () => {
    setIsSideMenuOpen(!isSideMenuOpen);
  };

  const pathname = usePathname();

  // If the current path starts with /virtualMeetHome, don't render the Nav
  if (pathname.startsWith("/virtualMeetHome")) {
    return null;
  }

  return (
    <nav className="flex items-center justify-between p-4 w-full bg-transparent relative">
      <Link href="/" className="flex items-center">
        <Image
          src="/images/logoWithText.png"
          alt="logo"
          width={160}
          height={160}
          className="object-contain"
        />
      </Link>

      <div className="flex items-center space-x-4 md:hidden">
        <button className="text-gray-700" onClick={handleSideMenuToggle}>
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            ></path>
          </svg>
        </button>
      </div>

      <div className="hidden md:flex items-center space-x-4">
        <Link
          href="/AboutUs"
          className="text-gray-700 no-underline hover:text-blue-400"
        >
          About Us
        </Link>
        {/* <div className="relative" ref={dropdownRef}>
          <div
            className="flex items-center cursor-pointer"
            onClick={handleDropdownClick}
          >
            <span className="text-gray-700 no-underline hover:text-blue-500 flex items-center">
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
          {toggleDropdown && (
            <div className="absolute left-0 mt-2 bg-gray-100 shadow-lg rounded-lg w-48">
              {[
                "Trade Shows",
                "Events Marketing",
                "Networking",
                "Career Fairs",
                "Recruiting Sessions",
                "Event Production",
              ].map((item) => (
                <Link
                  href="#"
                  key={item}
                  className="block px-4 py-2 text-gray-700 no-underline hover:text-blue-400"
                >
                  {item}
                </Link>
              ))}
            </div>
          )}
        </div> */}
        <Link
          href="/Contact"
          className="text-gray-700 no-underline hover:text-blue-400"
        >
          Contact Us
        </Link>
        <Link
          href="/Events"
          className="text-gray-700 no-underline hover:text-blue-400"
        >
          Events
        </Link>
        {session ? (
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="text-gray-700 no-underline hover:text-blue-400"
          >
            Sign Out
          </button>
        ) : (
          <>
            <Link
              href="/sign-in"
              className="text-gray-700 no-underline hover:text-blue-400"
            >
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className="text-gray-700 no-underline hover:text-blue-400"
            >
              Sign Up
            </Link>
          </>
        )}
        {/* <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gradient-to-br from-custom-start to-custom-end hover:text-white">
          Request quote
        </button> */}

        <Link href={session ? "/virtualMeetHome" : "/sign-in"}>
          <button
            className="px-4 py-2 bg-gradient-to-br from-custom-start to-custom-end text-white rounded-lg"
            onClick={handleGetStarted}
          >
            Get Started
          </button>
        </Link>
        {/* <ModeToggle /> */}
        {session && (
          <Link
            href="/profile"
            className="text-gray-700 no-underline hover:text-blue-400 flex items-center"
          >
            <Image
              src={userImage || "/images/user1.png"}
              alt="Profile Picture"
              width={50}
              height={50}
              className="rounded-full"
            />
          </Link>
        )}
      </div>

      {isSideMenuOpen && (
        <div
          ref={sideMenuRef}
          className="fixed inset-0 z-50 bg-gray-800 bg-opacity-75 flex flex-col items-center justify-center md:hidden"
        >
          <button
            className="absolute top-4 right-4 text-white"
            onClick={handleSideMenuToggle}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
          {session && (
            <Link
              href="/profile"
              className="text-white no-underline hover:text-blue-400 mb-4 flex items-center"
              onClick={handleSideMenuToggle}
            >
              <Image
                src={userImage || "/images/user1.png"}
                alt="Profile Picture"
                width={80}
                height={80}
                className="rounded-full"
              />
            </Link>
          )}
          <Link
            href="/AboutUs"
            className="text-white no-underline hover:text-blue-400 mb-4"
            onClick={handleSideMenuToggle}
          >
            About Us
          </Link>
          {/* <div className="relative mb-4">
            <div
              className="flex items-center cursor-pointer"
              onClick={handleDropdownClick}
            >
              <span className="text-white no-underline hover:text-blue-500 flex items-center">
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
            {toggleDropdown && (
              <div className="mt-2 mb-2 bg-transparent rounded-lg w-48 flex flex-col items-center">
                {[
                  "Trade Shows",
                  "Events Marketing",
                  "Networking",
                  "Career Fairs",
                  "Recruiting Sessions",
                  "Event Production",
                ].map((item) => (
                  <Link
                    href="#"
                    key={item}
                    className="block px-4 py-2 text-white no-underline hover:text-blue-400"
                    onClick={handleSideMenuToggle}
                  >
                    {item}
                  </Link>
                ))}
              </div>
            )}
          </div> */}
          <Link
            href="/Contact"
            className="text-white no-underline hover:text-blue-400 mb-4"
          >
            Contact Us
          </Link>
          {session ? (
            <>
              {/* <Link
                href="/profile"
                className="text-white no-underline hover:text-blue-400 mb-4 flex items-center"
                onClick={handleSideMenuToggle}
              >
                <Image
                  alt="Profile Picture"
                  width={32}
                  height={32}
                  className="rounded-full"
                />
                <span className="ml-2">My Profile</span>
              </Link> */}
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-white no-underline hover:text-blue-400 mb-4"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="text-white no-underline hover:text-blue-400 mb-4"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="text-white no-underline hover:text-blue-400 mb-4"
              >
                Sign Up
              </Link>
            </>
          )}
          {/* <button className="px-4 py-2 border border-white rounded text-white hover:bg-gradient-to-br from-custom-start to-custom-end hover:text-white mb-4">
            Request quote
          </button> */}
          <Link href={session ? "/virtualMeetHome" : "/sign-in"}>
            <button
              className="px-4 py-2 bg-gradient-to-br from-custom-start to-custom-end text-white rounded mb-4"
              onClick={handleGetStarted}
            >
              Get Started
            </button>
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Nav;
