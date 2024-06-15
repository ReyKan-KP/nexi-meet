"use client";
import { useState } from "react";
import HomeCard from "./HomeCard";
import { useRouter } from "next/navigation";
import MeetingModel from "@components/MeetingModel";
const MeetingTypeList = () => {
  const router = useRouter();
  const [meetingTypes, setMeetingTypes] = useState<
    "isScheduleEvent" | "isJoiningEvent" | "isInstantEvent" | undefined
  >();
  const createMeeting = () => {
    console.log("Meeting Created");
  };
  return (
    <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
      <HomeCard
        imgSrc="/icons/add-meeting.svg"
        title="Create New Event"
        description="Start an instant Event"
        handleClick={() => setMeetingTypes("isInstantEvent")}
      />
      <HomeCard
        imgSrc="/icons/schedule.svg"
        title="Schedule Event"
        description="Plan your Event"
        handleClick={() => setMeetingTypes("isScheduleEvent")}
        className="bg-purple-1"
      />
      <HomeCard
        imgSrc="/icons/recordings.svg"
        title="View Recordings"
        description="Check out your Recordings"
        handleClick={() => router.push("/virtualMeetHome/recordings")}
        className="bg-yellow-1"
      />
      <HomeCard
        imgSrc="/icons/join-meeting.svg"
        title="Join Event"
        description="via invitation link"
        handleClick={() => setMeetingTypes("isJoiningEvent")}
        className="bg-blue-1"
      />
      <MeetingModel
        isOpen={meetingTypes === "isInstantEvent"}
        onClose={() => setMeetingTypes(undefined)}
        title="Start an Instant Event"
        className="text-center"
        buttonText="Start Event"
        handleClick={createMeeting}
      />
    </section>
  );
};

export default MeetingTypeList;
