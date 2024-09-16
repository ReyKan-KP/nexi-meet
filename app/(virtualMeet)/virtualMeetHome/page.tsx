"use client";

import MeetingTypeList from "@components/VirtualMeetComponents/MeetingTypeList";
import UpcomingEventsList from "@components/VirtualMeetComponents/UpcomingEventsList";

const VirtualMeetHome = () => {
  return (
    <section className="flex flex-col gap-10 text-[#574476]">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2">
          Welcome to NexiMeet - Your Virtual Event Hub
        </h1>
        <p className="text-xl">
          Create, Schedule, Watch, and Join your events seamlessly!
        </p>
      </div>

      <MeetingTypeList />

      <div>
        <h2 className="text-2xl font-bold mb-4">Upcoming Events</h2>
        <UpcomingEventsList />
      </div>
    </section>
  );
};

export default VirtualMeetHome;
