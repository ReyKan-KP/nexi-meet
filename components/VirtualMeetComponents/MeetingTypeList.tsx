"use client";

import { useState } from "react";
import HomeCard from "@components/VirtualMeetComponents/HomeCard";
import { useRouter } from "next/navigation";
import MeetingModel from "@components/VirtualMeetComponents/MeetingModel";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useSession } from "next-auth/react";
import Loader from "@components/ui/Loader";
import { Textarea } from "@components/ui/textarea";
import ReactDatePicker from "react-datepicker";
import { Input } from "@components/ui/input";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const initialValues = {
  dateTime: new Date(),
  description: "",
  link: "",
};

const MeetingTypeList = () => {
  const router = useRouter();
  const [eventState, setEventState] = useState<
    "isScheduleEvent" | "isJoiningEvent" | "isInstantEvent" | undefined
  >(undefined);
  const [values, setValues] = useState(initialValues);
  const [callDetail, setCallDetail] = useState<Call>();
  const client = useStreamVideoClient();
  const { data: session, status } = useSession();

  // console.log("id",session?.user.id);
  const createEvent = async () => {
    if (!client || !session?.user) return;
    try {
      if (!values.dateTime) {
        toast.error("Please select a date and time");
        return;
      }
      const id = crypto.randomUUID();
      const call = client.call("default", id);
      if (!call) throw new Error("Failed to create event");
      const startsAt =
        values.dateTime.toISOString() || new Date(Date.now()).toISOString();
      const description = values.description || "Instant Event";
      await call.getOrCreate({
        data: {
          starts_at: startsAt,
          custom: {
            description,
          },
        },
      });
      setCallDetail(call);
      console.log("call", call);
      console.log("values", values);

      if (!values.description) {
        router.push(`/meeting/${call.id}`);
      }
      toast.success("Event Created");
    } catch (error) {
      console.error(error);
      toast.error("Failed to create Event");
    }
  };

  if (!client || status !== "authenticated") return <Loader />;

  const eventLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetail?.id}`;

  return (
    <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
      <HomeCard
        imgSrc="/icons/add-meeting.svg"
        title="Create New Event"
        description="Start an instant Event"
        handleClick={() => setEventState("isInstantEvent")}
      />
      <HomeCard
        imgSrc="/icons/schedule.svg"
        title="Schedule Event"
        description="Plan your Event"
        handleClick={() => setEventState("isScheduleEvent")}
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
        handleClick={() => setEventState("isJoiningEvent")}
        className="bg-blue-1"
      />

      {!callDetail ? (
        <MeetingModel
          isOpen={eventState === "isScheduleEvent"}
          onClose={() => setEventState(undefined)}
          title="Create Event"
          handleClick={createEvent}
        >
          <div className="flex flex-col gap-2.5">
            <label className="text-base font-normal leading-[22.4px] text-sky-2">
              Add a description
            </label>
            <Textarea
              className="border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0 text-black"
              onChange={(e) =>
                setValues({ ...values, description: e.target.value })
              }
            />
          </div>
          <div className="flex w-full flex-col gap-2.5">
            <label className="text-base font-normal leading-[22.4px] text-sky-2">
              Select Date and Time
            </label>
            <ReactDatePicker
              selected={values.dateTime}
              onChange={(date) => setValues({ ...values, dateTime: date! })}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              timeCaption="time"
              dateFormat="MMMM d, yyyy h:mm aa"
              className="w-full rounded bg-dark-3 p-2 focus:outline-none text-black"
            />
          </div>
        </MeetingModel>
      ) : (
        <MeetingModel
          isOpen={eventState === "isScheduleEvent"}
          onClose={() => setEventState(undefined)}
          title="Event Created"
          handleClick={() => {
            navigator.clipboard.writeText(eventLink);
            toast.success("Link Copied");
          }}
          image={"/icons/checked.svg"}
          buttonIcon="/icons/copy.svg"
          className="text-center"
          buttonText="Copy Event Link"
        />
      )}

      <MeetingModel
        isOpen={eventState === "isJoiningEvent"}
        onClose={() => setEventState(undefined)}
        title="Type the link here"
        className="text-center"
        buttonText="Join Event"
        handleClick={() => router.push(values.link)}
      >
        <Input
          placeholder="Event link"
          onChange={(e) => setValues({ ...values, link: e.target.value })}
          className="border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0 text-black"
        />
      </MeetingModel>

      <MeetingModel
        isOpen={eventState === "isInstantEvent"}
        onClose={() => setEventState(undefined)}
        title="Start an Instant Event"
        className="text-center"
        buttonText="Start Event"
        handleClick={createEvent}
      />
      <ToastContainer />
    </section>
  );
};

export default MeetingTypeList;
