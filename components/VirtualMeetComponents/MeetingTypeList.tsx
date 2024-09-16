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
import { BentoGrid, BentoCard } from "@/components/magicui/bento-grid";
import { PlusIcon, CalendarIcon, PlayIcon, UsersIcon } from "lucide-react";

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

      // Store the event in the database
      // const eventLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${call.id}`;
      // const noteData = {
      //   userId: session.user.id,
      //   userName: session.user.name,
      //   userEmail: session.user.email,
      //   date: values.dateTime,
      //   time: values.dateTime.toLocaleTimeString(),
      //   text: description,
      //   link: eventLink,
      // };

      // const response = await fetch('/api/notes/create', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(noteData),
      // });

      // if (!response.ok) {
      //   throw new Error('Failed to save note');
      // }

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

  const meetingTypes = [
    {
      Icon: PlusIcon,
      name: "Create New Event",
      description: "Start an instant Event",
      href: "#",
      cta: "Create Event",
      className: "col-span-2 md:col-span-2",
      handleClick: () => setEventState("isInstantEvent"),
      background: (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800" />
      ),
    },
    {
      Icon: CalendarIcon,
      name: "Schedule Event",
      description: "Plan your Event",
      href: "#",
      cta: "Schedule",
      className: "col-span-2 md:col-span-2",
      handleClick: () => setEventState("isScheduleEvent"),
      background: (
        <div className="absolute inset-0 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900 dark:to-purple-800" />
      ),
    },
    {
      Icon: PlayIcon,
      name: "View Recordings",
      description: "Check out your Recordings",
      href: "/virtualMeetHome/recordings",
      cta: "View",
      className: "col-span-2 md:col-span-2",
      handleClick: () => router.push("/virtualMeetHome/recordings"),
      background: (
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-900 dark:to-yellow-800" />
      ),
    },
    {
      Icon: UsersIcon,
      name: "Join Event",
      description: "via invitation link",
      href: "#",
      cta: "Join",
      className: "col-span-2 md:col-span-2",
      handleClick: () => setEventState("isJoiningEvent"),
      background: (
        <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900 dark:to-green-800" />
      ),
    },
  ];
  // console.log(callDetail);

  return (
    <>
      <BentoGrid className="grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[12rem] md:auto-rows-[16rem]">
        {meetingTypes.map((type, idx) => (
          <BentoCard key={idx} {...type} />
        ))}
      </BentoGrid>

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
    </>
  );
};

export default MeetingTypeList;
