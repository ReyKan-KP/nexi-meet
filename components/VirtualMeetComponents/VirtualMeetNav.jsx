"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import { sidebarLinks } from "@constants/index";

const VirtualMeetNav = () => {
  const { data: session, status } = useSession();
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const sideMenuRef = useRef(null);

  const handleClickOutside = (event) => {
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

  return (
    <nav className="flex items-center justify-between p-4 w-full bg-transparent relative">
      <Link href="/" className="flex items-center">
        <Image
          src="/images/logoWithText.png"
          alt="NexiMeet Logo"
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
        {sidebarLinks.map((link) => (
          <Link
            key={link.route}
            href={link.route}
            className="text-gray-700 no-underline hover:text-blue-400 flex items-center"
          >
            {/* <Image
              src={link.imgUrl}
              alt={link.label}
              width={20}
              height={20}
              className="mr-2"
            /> */}
            {link.label}
          </Link>
        ))}
        {session ? (
          <>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="text-gray-700 no-underline hover:text-blue-400"
            >
              Sign Out
            </button>
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
          </>
        ) : (
          <Link
            href="/sign-in"
            className="text-gray-700 no-underline hover:text-blue-400"
          >
            Sign In
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
          {sidebarLinks.map((link) => (
            <Link
              key={link.route}
              href={link.route}
              className="text-white no-underline hover:text-blue-400 mb-4 flex items-center"
              onClick={handleSideMenuToggle}
            >
              <Image
                src={link.imgUrl}
                alt={link.label}
                width={20}
                height={20}
                className="mr-2"
              />
              {link.label}
            </Link>
          ))}
          {session ? (
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="text-white no-underline hover:text-blue-400 mb-4"
            >
              Sign Out
            </button>
          ) : (
            <Link
              href="/sign-in"
              className="text-white no-underline hover:text-blue-400 mb-4"
            >
              Sign In
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default VirtualMeetNav;
