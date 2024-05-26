"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Tab } from "@headlessui/react";
import Image from "next/image";
import UserProfileForm from "@components/ProfileComponents/UserProfileForm";
import PrivacySettings from "@components/ProfileComponents/PrivacySettings";
import ActivityLog from "@components/ProfileComponents/ActivityLog";
import LinkedSocialAccounts from "@components/ProfileComponents/LinkedSocialAccounts";
import CalendarWithNotes from "@components/ProfileComponents/CalendarWithNotes";
import OrganizerSection from "@components/ProfileComponents/RoleSpecific/OrganizerSection";
import SpeakerSection from "@components/ProfileComponents/RoleSpecific/SpeakerSection";
import ExhibitorSection from "@components/ProfileComponents/RoleSpecific/ExhibitorSection";
import AttendeeSection from "@components/ProfileComponents/RoleSpecific/AttendeeSection";

interface SessionData {
  user?: {
    name?: string;
    email?: string;
    role?: string;
    image?: string;
    id?: string;
  };
}

const MyProfile: React.FC = () => {
  const { data: session, status } = useSession() as {
    data: SessionData;
    status: "loading" | "authenticated" | "unauthenticated";
  };
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<string>("General Information");
  const [userProfile, setUserProfile] = useState<{
    name?: string;
    email?: string;
    image?: string;
  }>({});

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

      fetchUserProfile();
    }
  }, [status, session]);

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  const tabs = [
    "Update Profile",
    "Role-Specific",
    "Privacy Settings",
    "Activity Log",
    "Linked Social Accounts",
    "Calendar",
  ];

  const { name, email, image } = userProfile;
  return (
    <div className="container mx-auto px-4 py-10 sm:px-6 sm:py-16 lg:px-8 lg:py-24">
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
            <p className="text-gray-600">Role: {session?.user?.role}</p>
          </div>
        </div>
      </div>

      <Tab.Group
        selectedIndex={tabs.indexOf(selectedTab)}
        onChange={(index: number) => setSelectedTab(tabs[index])}
      >
        <Tab.List className="flex flex-wrap justify-center md:justify-start gap-2 mt-6">
          {tabs.map((tab) => (
            <Tab
              key={tab}
              className={({ selected }: { selected: boolean }) =>
                `py-2 px-4 rounded-lg font-semibold transition ${
                  selected
                    ? "bg-teal-700 text-white shadow-lg"
                    : "bg-gray-200 text-gray-700 hover:bg-teal-500 hover:text-white"
                }`
              }
            >
              {tab}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="mt-4">
          <Tab.Panel>
            <UserProfileForm />
          </Tab.Panel>
          <Tab.Panel>
            <RoleSpecific role={session?.user?.role} />
          </Tab.Panel>
          <Tab.Panel>
            <PrivacySettings />
          </Tab.Panel>
          <Tab.Panel>
            <ActivityLog />
          </Tab.Panel>
          <Tab.Panel>
            <LinkedSocialAccounts />
          </Tab.Panel>
          <Tab.Panel>
            <CalendarWithNotes />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

interface RoleSpecificProps {
  role: string | undefined;
}

const RoleSpecific: React.FC<RoleSpecificProps> = ({ role }) => {
  switch (role) {
    case "organizer":
      return <OrganizerSection />;
    case "speaker":
      return <SpeakerSection />;
    case "exhibitor":
      return <ExhibitorSection />;
    case "attendee":
      return <AttendeeSection />;
    // case "Support Staff":
    //   return <SupportSection />;
    default:
      return (
        <div className="text-center text-teal-700">
          Role-specific content not available.
        </div>
      );
  }
};

// const SupportSection: React.FC = () => (
//   <div>
//     <h2 className="text-lg font-bold text-black mb-2">Support Tickets</h2>
//     <div>Ticket List...</div>
//   </div>
// );

export default MyProfile;
