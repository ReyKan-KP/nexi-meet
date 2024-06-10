"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Badge from "@mui/material/Badge";
import IconButton from "@mui/material/IconButton";
import { Bell } from "lucide-react";
import ClickAwayListener from "@mui/material/ClickAwayListener";

import UserProfileForm from "@components/ProfileComponents/Settings/UserProfileForm";
import PrivacySettings from "@components/ProfileComponents/Settings/PrivacySettings";
import Notifications from "@components/ProfileComponents/Settings/Notifications";
import AccountSecurity from "@components/ProfileComponents/Settings/AccountSecurity";
import ConnectedApps from "@components/ProfileComponents/Settings/ConnectedApps";
import ActivityLog from "@components/ProfileComponents/ActivityLog";
import LinkedSocialAccounts from "@components/ProfileComponents/LinkedSocialAccounts";
import CalendarWithNotes from "@components/ProfileComponents/CalendarWithNotes";
// import UserDashboard from "@components/ProfileComponents/UserDashboard";
import OrganizerSection from "@components/ProfileComponents/RoleSpecific/OrganizerSection";
import SpeakerSection from "@components/ProfileComponents/RoleSpecific/SpeakerSection";
import ExhibitorSection from "@components/ProfileComponents/RoleSpecific/ExhibitorSection";
import AttendeeSection from "@components/ProfileComponents/RoleSpecific/AttendeeSection";
import NotificationBell from "@components/ProfileComponents/NotificationBell";

interface SessionData {
  user?: {
    name?: string;
    email?: string;
    role?: string;
    image?: string;
    id?: string;
  };
}

interface Note {
  id: string;
  text: string;
  date: string;
  isRead: boolean;
}

const MyProfile: React.FC = () => {
  const { data: session, status } = useSession() as {
    data: SessionData;
    status: "loading" | "authenticated" | "unauthenticated";
  };
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<string>("User Dashboard");
  const [selectedSetting, setSelectedSetting] =
    useState<string>("UserProfileForm");
  const [userProfile, setUserProfile] = useState<{
    name?: string;
    email?: string;
    image?: string;
    bio?: string;
    phoneNumber?: string;
    profileVisibility?: string;
  }>({});
  const [notes, setNotes] = useState<Note[]>([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [isBellOpen, setIsBellOpen] = useState(false);

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
          setUserProfile(data);
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      };

      const fetchNotes = async () => {
        try {
          const response = await fetch(`/api/notes?user=${userId}`);
          if (!response.ok) {
            throw new Error("Failed to fetch notes");
          }
          const data = await response.json();
          setNotes(data);
          checkForUpcomingNotes(data);
        } catch (error) {
          console.error("Error fetching notes:", error);
        }
      };

      fetchUserProfile();
      fetchNotes();
    }
  }, [status, session]);
  const { name, email, image, bio, phoneNumber, profileVisibility } =
    userProfile;
  const checkForUpcomingNotes = (notes: Note[]) => {
    const now = new Date();

    const upcomingNotes = notes.filter((note) => {
      const noteDate = new Date(note.date);
      return (
        (noteDate.getTime() - now.getTime() <= 3600000 && noteDate > now) || // within 1 hour
        (noteDate.getTime() - now.getTime() <= 86400000 && noteDate > now) || // within 1 day
        (noteDate.getTime() - now.getTime() <= 300000 && noteDate > now) // within 5 minutes
      );
    });

    const unreadCount = upcomingNotes.filter((note) => !note.isRead).length;
    setNotificationCount(unreadCount);
  };

  const handleBellClick = () => {
    setIsBellOpen(!isBellOpen);
  };

  const handleClickAway = () => {
    setIsBellOpen(false);
  };

  const markAsRead = (id: string) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note.id === id ? { ...note, isRead: true } : note
      )
    );
    setNotificationCount((prevCount) => prevCount - 1);
  };

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  const tabs = [
    // "User Dashboard",
    "Calendar",
    "Role-Specific",
    "Activity Log",
    "Linked Social Accounts",
    "Settings",
  ];

  const handleChange = (event: any, newValue: React.SetStateAction<string>) => {
    setSelectedTab(newValue);
  };

  const renderSettingsContent = () => {
    switch (selectedSetting) {
      case "UserProfileForm":
        return <UserProfileForm />;
      case "PrivacySettings":
        return <PrivacySettings />;
      case "Notifications":
        return <Notifications />;
      case "AccountSecurity":
        return <AccountSecurity />;
      case "ConnectedApps":
        return <ConnectedApps />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto sm:px-6 sm:py-16">
      <div className="bg-white rounded-lg p-6">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex flex-col items-center space-y-4 md:flex-row md:items-start md:space-x-6">
            <Image
              src={image || "/images/user1.png"}
              width={80}
              height={80}
              alt="Profile"
              className="w-20 h-20 rounded-full shadow-lg"
            />
            <div className="text-center md:text-left">
              <h1 className="text-2xl font-bold text-teal-700">{name}</h1>
              <p className="text-gray-600">{email}</p>
              <p className="text-gray-600">Phone: {phoneNumber}</p>
              <p className="text-gray-600">Role: {session?.user?.role}</p>
              <p className="text-gray-600">Visibility: {profileVisibility}</p>
              <p className="text-gray-600">Bio: {bio}</p>
            </div>
            <div className="flex justify-end ">
              <ClickAwayListener onClickAway={handleClickAway}>
                <div className="relative">
                  <IconButton color="inherit" onClick={handleBellClick}>
                    <Badge badgeContent={notificationCount} color="secondary">
                      <Bell />
                    </Badge>
                  </IconButton>
                  {isBellOpen && (
                    <NotificationBell
                      notifications={notes}
                      markAsRead={markAsRead}
                    />
                  )}
                </div>
              </ClickAwayListener>
            </div>
          </div>
        </div>
        <div className="mt-6">
          {/* <Box sx={{ overflowX: "auto" }}> */}
          <Tabs
            value={selectedTab}
            onChange={handleChange}
            centered
            className="justify-center"
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
          >
            {tabs.map((tab) => (
              <Tab key={tab} label={tab} value={tab} />
            ))}
          </Tabs>
          {/* </Box> */}
          {/* {selectedTab === "User Dashboard" && <UserDashboard />} */}
          {selectedTab === "Calendar" && <CalendarWithNotes />}
          {selectedTab === "Role-Specific" && (
            <RoleSpecific role={session?.user?.role} />
          )}
          {selectedTab === "Activity Log" && <ActivityLog />}
          {selectedTab === "Linked Social Accounts" && <LinkedSocialAccounts />}
          {selectedTab === "Settings" && (
            <div className="mt-4 flex flex-row">
              <div className="flex-none w-1/4 p-4">
                <ul className="flex flex-col space-y-4">
                  <li>
                    <button
                      onClick={() => setSelectedSetting("UserProfileForm")}
                      className={`w-full text-left ${
                        selectedSetting === "UserProfileForm"
                          ? "text-teal-700 font-bold"
                          : "text-gray-700"
                      }`}
                    >
                      Profile
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setSelectedSetting("PrivacySettings")}
                      className={`w-full text-left ${
                        selectedSetting === "PrivacySettings"
                          ? "text-teal-700 font-bold"
                          : "text-gray-700"
                      }`}
                    >
                      Privacy Settings
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setSelectedSetting("Notifications")}
                      className={`w-full text-left ${
                        selectedSetting === "Notifications"
                          ? "text-teal-700 font-bold"
                          : "text-gray-700"
                      }`}
                    >
                      Notifications
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setSelectedSetting("AccountSecurity")}
                      className={`w-full text-left ${
                        selectedSetting === "AccountSecurity"
                          ? "text-teal-700 font-bold"
                          : "text-gray-700"
                      }`}
                    >
                      Account Security
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setSelectedSetting("ConnectedApps")}
                      className={`w-full text-left ${
                        selectedSetting === "ConnectedApps"
                          ? "text-teal-700 font-bold"
                          : "text-gray-700"
                      }`}
                    >
                      Connected Apps
                    </button>
                  </li>
                </ul>
              </div>
              <div className="flex-grow p-4">{renderSettingsContent()}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const RoleSpecific: React.FC<{ role?: string }> = ({ role }) => {
  switch (role) {
    case "organizer":
      return <OrganizerSection />;
    case "speaker":
      return <SpeakerSection />;
    case "exhibitor":
      return <ExhibitorSection />;
    case "attendee":
      return <AttendeeSection />;
    default:
      return null;
  }
};






export default MyProfile;
