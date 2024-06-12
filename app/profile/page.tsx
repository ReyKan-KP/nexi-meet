"use client";

import { lazy, Suspense, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Badge from "@mui/material/Badge";
import IconButton from "@mui/material/IconButton";
import { Bell } from "lucide-react";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Loader from "@components/ui/Loader";

const UserProfileForm = lazy(
  () => import("@components/ProfileComponents/Settings/UserProfileForm")
);
const PrivacySettings = lazy(
  () => import("@components/ProfileComponents/Settings/PrivacySettings")
);
const Notifications = lazy(
  () => import("@components/ProfileComponents/Settings/Notifications")
);
const AccountSecurity = lazy(
  () => import("@components/ProfileComponents/Settings/AccountSecurity")
);
const ConnectedApps = lazy(
  () => import("@components/ProfileComponents/Settings/ConnectedApps")
);
const ActivityLog = lazy(
  () => import("@components/ProfileComponents/ActivityLog")
);
const LinkedSocialAccounts = lazy(
  () => import("@components/ProfileComponents/LinkedSocialAccounts")
);
const CalendarWithNotes = lazy(
  () => import("@components/ProfileComponents/CalendarWithNotes")
);
const OrganizerSection = lazy(
  () => import("@components/ProfileComponents/RoleSpecific/OrganizerSection")
);
const SpeakerSection = lazy(
  () => import("@components/ProfileComponents/RoleSpecific/SpeakerSection")
);
const ExhibitorSection = lazy(
  () => import("@components/ProfileComponents/RoleSpecific/ExhibitorSection")
);
const AttendeeSection = lazy(
  () => import("@components/ProfileComponents/RoleSpecific/AttendeeSection")
);
const NotificationBell = lazy(
  () => import("@components/ProfileComponents/NotificationBell")
);

// import UserDashboard from "@components/ProfileComponents/UserDashboard";

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
  const [selectedTab, setSelectedTab] = useState<string>("Calendar");
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
        (noteDate.getTime() - now.getTime() <= 3600000 && noteDate > now) ||
        (noteDate.getTime() - now.getTime() <= 86400000 && noteDate > now) ||
        (noteDate.getTime() - now.getTime() <= 300000 && noteDate > now)
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
        <Loader color="#36d7b7" />
    );
  }

  const tabs = [
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
        return (
          <Suspense fallback={<Loader color="#36d7b7" />}>
            <UserProfileForm />
          </Suspense>
        );
      case "PrivacySettings":
        return (
          <Suspense fallback={<Loader color="#36d7b7" />}>
            <PrivacySettings />
          </Suspense>
        );
      case "Notifications":
        return (
          <Suspense fallback={<Loader color="#36d7b7" />}>
            <Notifications />
          </Suspense>
        );
      case "AccountSecurity":
        return (
          <Suspense fallback={<Loader color="#36d7b7" />}>
            <AccountSecurity />
          </Suspense>
        );
      case "ConnectedApps":
        return (
          <Suspense fallback={<Loader color="#36d7b7" />}>
            <ConnectedApps />
          </Suspense>
        );
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
            <div className="flex justify-end md:ml-auto">
              <ClickAwayListener onClickAway={handleClickAway}>
                <div className="relative">
                  <IconButton color="inherit" onClick={handleBellClick}>
                    <Badge badgeContent={notificationCount} color="secondary">
                      <Bell />
                    </Badge>
                  </IconButton>
                  {isBellOpen && (
                    <Suspense fallback={<Loader color="#36d7b7" />}>
                      <NotificationBell
                        notifications={notes}
                        markAsRead={markAsRead}
                      />
                    </Suspense>
                  )}
                </div>
              </ClickAwayListener>
            </div>
          </div>
        </div>
        <div className="mt-6">
          <Tabs
            value={selectedTab}
            onChange={handleChange}
            centered
            className="justify-center"
            variant="fullWidth"
          >
            {tabs.map((tab) => (
              <Tab key={tab} label={tab} value={tab} />
            ))}
          </Tabs>
          {selectedTab === "Calendar" && (
            <Suspense fallback={<Loader color="#36d7b7" />}>
              <CalendarWithNotes />
            </Suspense>
          )}
          {selectedTab === "Role-Specific" && (
            <Suspense fallback={<Loader color="#36d7b7" />}>
              <RoleSpecific role={session?.user?.role} />
            </Suspense>
          )}
          {selectedTab === "Activity Log" && (
            <Suspense fallback={<Loader color="#36d7b7" />}>
              <ActivityLog />
            </Suspense>
          )}
          {selectedTab === "Linked Social Accounts" && (
            <Suspense fallback={<Loader color="#36d7b7" />}>
              <LinkedSocialAccounts />
            </Suspense>
          )}
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
                      Privacy
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

interface RoleSpecificProps {
  role?: string;
}

const RoleSpecific: React.FC<RoleSpecificProps> = ({ role }) => {
  switch (role) {
    case "organizer":
      return (
        <Suspense fallback={<Loader color="#36d7b7" />}>
          <OrganizerSection />
        </Suspense>
      );
    case "speaker":
      return (
        <Suspense fallback={<Loader color="#36d7b7" />}>
          <SpeakerSection />
        </Suspense>
      );
    case "exhibitor":
      return (
        <Suspense fallback={<Loader color="#36d7b7" />}>
          <ExhibitorSection />
        </Suspense>
      );
    case "attendee":
      return (
        <Suspense fallback={<Loader color="#36d7b7" />}>
          <AttendeeSection />
        </Suspense>
      );
    default:
      return null;
  }
};


export default MyProfile;
