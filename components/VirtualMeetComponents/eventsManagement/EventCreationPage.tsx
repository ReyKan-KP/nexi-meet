"use client";

import React, { useState, useEffect } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import dynamic from "next/dynamic";
import { FaCheck, FaPlus, FaTrash } from "react-icons/fa";
import Image from "next/image";
import { FileUpload } from "@/components/ui/file-upload";
import { useSession } from "next-auth/react";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { toast, ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";

const RichTextEditor = dynamic(() => import("@/components/RichTextEditor"), {
  ssr: false,
});

interface SponsorWithPreview {
  file: File;
  preview: string;
}

const EventCreationPage: React.FC = () => {
  const { data: session } = useSession();
  const { control, handleSubmit, watch, register, setValue } = useForm<{
    eventName: string;
    eventDescription: string;
    eventCategory: string;
    otherCategory?: string;
    startDate: Date;
    startTime: string;
    endDate: Date;
    endTime: string;
    locationType: "virtual" | "physical";
    virtualLink: string;
    physicalAddress: string;
    organizer: {
      name: string;
      image: File | null | string | any;
    };
    banner: File | null;
    agenda: { time: string; title: string; speaker: string }[];
    sponsors: { file: File }[];
    ticketType: "free" | "paid";
    capacity: string;
    isPrivate: boolean;
    userId: string;
    userName: string;
    userEmail: string;
    bankAccountNumber?: string;
    upiId?: string;
    paymentMethod?: "bank" | "upi";
    ticketPrice?: number;
  }>({
    defaultValues: {
      eventName: "",
      eventDescription: "",
      eventCategory: "",
      startDate: new Date(),
      startTime: "",
      endDate: new Date(),
      endTime: "",
      locationType: "virtual",
      virtualLink: "",
      physicalAddress: "",
      organizer: {
        name: "",
        image: null,
      },
      banner: null,
      agenda: [{ time: "", title: "", speaker: "" }],
      sponsors: [],
      ticketType: "free",
      capacity: "",
      isPrivate: false,
      userId: "",
      userName: "",
      userEmail: "",
    },
  });

  useEffect(() => {
    if (session?.user) {
      setValue("userId", session.user.id);
      setValue("userName", session.user?.name ?? "");
      setValue("userEmail", session.user?.email ?? "");

      // Fetch user profile data
      const fetchUserProfile = async () => {
        try {
          const response = await fetch(`/api/updateProfile?id=${session.user.id}`);
          if (response.ok) {
            const userData = await response.json();
            setValue("organizer.name", userData.name);
            if (userData.image) {
              setValue("organizer.image", userData.image);
            }
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      };

      fetchUserProfile();
    }
  }, [session, setValue]);

  const {
    fields: agendaFields,
    append: appendAgenda,
    remove: removeAgenda,
  } = useFieldArray({
    control,
    name: "agenda",
  });

  const {
    fields: sponsorFields,
    append: appendSponsor,
    remove: removeSponsor,
  } = useFieldArray({
    control,
    name: "sponsors",
  });

  const [sponsorsWithPreview, setSponsorsWithPreview] = useState<SponsorWithPreview[]>([]);
  const [step, setStep] = useState(1);
  const totalSteps = 7; // Total number of steps
  const progressControls = useAnimation();
   const client = useStreamVideoClient();
  const router = useRouter();
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);

  const onSubmit = async (data: any) => {
    try {
      // Function to upload a file and return its URL
      const uploadFile = async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("File upload failed");
        }

        const result = await response.json();
        return result.url;
      };

      // Upload organizer image if it exists
      let organizerImageUrl = "";
      if (data.organizer.image) {
        organizerImageUrl = await uploadFile(data.organizer.image);
      }

      // Upload event banner if it exists
      let bannerUrl = "";
      if (data.banner) {
        bannerUrl = await uploadFile(data.banner);
      }

      // Upload sponsor files if any
      const sponsorUrls: string[] = [];
      for (const sponsor of data.sponsors) {
        const url = await uploadFile(sponsor.file);
        sponsorUrls.push(url);
      }

      // Prepare the event data with uploaded file URLs
      const eventData = {
        eventName: data.eventName,
        eventDescription: data.eventDescription,
        eventCategory: data.eventCategory,
        startDate: data.startDate,
        startTime: data.startTime,
        endDate: data.endDate,
        endTime: data.endTime,
        locationType: data.locationType,
        virtualLink: data.locationType === "virtual" ? data.virtualLink : undefined,
        physicalAddress: data.locationType === "physical" ? data.physicalAddress : undefined,
        organizer: {
          name: data.organizer.name,
          imageUrl: organizerImageUrl,
        },
        bannerUrl: bannerUrl || undefined,
        agenda: data.agenda,
        sponsors: sponsorUrls.map((url) => ({ fileUrl: url })),
        ticketType: data.ticketType,
        capacity: parseInt(data.capacity, 10),
        isPrivate: data.isPrivate,
        userId: data.userId,
        userName: data.userName,
        userEmail: data.userEmail,
      };

      // Send the event data to the API
      const response = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Event created successfully:", result);
        toast.success("Event created successfully!"); // Show success message
        // Optionally, reset the form or redirect the user
      } else {
        const error = await response.json();
        console.error("Error creating event:", error.message);
        // Optionally, display error to the user
      }
    } catch (error) {
      console.error("Submission error:", error);
      // Optionally, display error to the user
    }
  };

  const handleFileUpload = (files: File[]) => {
    console.log("Uploaded files:", files); // Debugging
    if (step === 3) {
      setValue("organizer.image", files[0]);
    } else if (step === 4) {
      setValue("banner", files[0]);
    } else if (step === 6) {
      files.forEach((file) => {
        console.log("Appending sponsor file:", file); // Debugging
        const preview = URL.createObjectURL(file);
        setSponsorsWithPreview((prev) => [...prev, { file, preview }]);
        appendSponsor({ file });
      });
    }
  };

  useEffect(() => {
    progressControls.start({
      width: `${(step / totalSteps) * 100}%`,
      transition: { type: "spring", stiffness: 60, damping: 12 },
    });
  }, [step, totalSteps, progressControls]);

  useEffect(() => {
    // Cleanup object URLs on unmount or when sponsors change
    return () => {
      sponsorsWithPreview.forEach((sponsor) => URL.revokeObjectURL(sponsor.preview));
    };
  }, [sponsorsWithPreview]);

  const generateMeetingLink = async () => {
    if (!client || !session?.user) {
      toast.error("You must be logged in to generate a meeting link");
      return;
    }

    try {
      const id = crypto.randomUUID();
      const call = client.call("default", id);
      if (!call) throw new Error("Failed to create event");

      const startsAt = watch("startDate").toISOString();
      const description = watch("eventName") || "Virtual Event";

      await call.getOrCreate({
        data: {
          starts_at: startsAt,
          custom: {
            description,
          },
        },
      });

      const eventLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${call.id}`;
      setGeneratedLink(eventLink);
      setValue("virtualLink", eventLink);
      toast.success("Meeting link generated successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate meeting link");
    }
  };

  const copyToClipboard = () => {
    if (generatedLink) {
      navigator.clipboard.writeText(generatedLink);
      toast.success("Link copied to clipboard");
    }
  };

  const renderStep = (currentStep: number) => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <h2 className="text-3xl font-semibold text-gray-800 mb-6">
              Event Details
            </h2>
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="eventName"
                  className="block font-medium text-lg text-gray-700 mb-1"
                >
                  Event Name
                </label>
                <Controller
                  name="eventName"
                  control={control}
                  rules={{ required: "Event name is required" }}
                  render={({ field, fieldState: { error } }) => (
                    <motion.div
                      initial={false}
                      animate={error ? { x: [-10, 10, -10, 10, 0] } : {}}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 10,
                      }}
                    >
                      <input
                        id="eventName"
                        {...field}
                        placeholder="Enter event name"
                        className={`w-full h-12 px-3 border ${
                          error ? "border-red-500" : "border-gray-300"
                        } rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-300 ease-in-out`}
                      />
                      {error && (
                        <p className="text-red-500 text-sm mt-1">
                          {error.message}
                        </p>
                      )}
                    </motion.div>
                  )}
                />
              </div>

              <div>
                <label
                  htmlFor="eventDescription"
                  className="block text-lg font-medium text-gray-700 mb-1"
                >
                  Event Description
                </label>
                <Controller
                  name="eventDescription"
                  control={control}
                  render={({ field }) => <RichTextEditor {...field} />}
                />
              </div>

              <div>
                <label
                  htmlFor="eventCategory"
                  className="block text-lg font-medium text-gray-700 mb-1"
                >
                  Event Category
                </label>
                <Controller
                  name="eventCategory"
                  control={control}
                  rules={{ required: "Event category is required" }}
                  render={({ field, fieldState: { error } }) => (
                    <>
                      <select
                        id="eventCategory"
                        {...field}
                        className={`w-full h-12 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                          error ? "border-red-500" : ""
                        }`}
                        onChange={(e) => {
                          field.onChange(e);
                          if (e.target.value !== "other") {
                            setValue("otherCategory", ""); // Clear other category if not selected
                          }
                        }}
                      >
                        <option value="">Select Category</option>
                        <option value="conference">Conference</option>
                        <option value="workshop">Workshop</option>
                        <option value="webinar">Webinar</option>
                        <option value="other">Other</option>{" "}
                        {/* Added Other option */}
                      </select>
                      {error && (
                        <p className="text-red-500 text-sm mt-1">
                          {error.message}
                        </p>
                      )}
                      {watch("eventCategory") === "other" && ( // Show input if Other is selected
                        <input
                          type="text"
                          placeholder="Please specify"
                          className="w-full h-10 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 mt-2"
                          {...register("otherCategory", {
                            required: "Please specify the category",
                          })}
                        />
                      )}
                    </>
                  )}
                />
              </div>
            </div>
          </>
        );
      case 2:
        return (
          <>
            <h2 className="text-3xl font-semibold text-gray-800 mb-6">
              Date and Location
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Start Date
                </label>
                <Controller
                  name="startDate"
                  control={control}
                  render={({ field }) => (
                    <Calendar
                      onChange={field.onChange}
                      value={field.value}
                      className="border border-gray-300 rounded-md w-full text-sm"
                    />
                  )}
                />
                <label className="block text-sm font-medium text-gray-700 mt-2">
                  Start Time
                </label>
                <Controller
                  name="startTime"
                  control={control}
                  rules={{ required: "Start time is required" }}
                  render={({ field, fieldState: { error } }) => (
                    <>
                      <input
                        type="time"
                        {...field}
                        className={`w-full h-10 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                          error ? "border-red-500" : ""
                        }`}
                      />
                      {error && (
                        <p className="text-red-500 text-sm mt-1">
                          {error.message}
                        </p>
                      )}
                    </>
                  )}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  End Date
                </label>
                <Controller
                  name="endDate"
                  control={control}
                  render={({ field }) => (
                    <Calendar
                      onChange={field.onChange}
                      value={field.value}
                      className="border border-gray-300 rounded-md w-full text-sm"
                    />
                  )}
                />
                <label className="block text-sm font-medium text-gray-700 mt-2">
                  End Time
                </label>
                <Controller
                  name="endTime"
                  control={control}
                  rules={{ required: "End time is required" }}
                  render={({ field, fieldState: { error } }) => (
                    <>
                      <input
                        type="time"
                        {...field}
                        className={`w-full h-10 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                          error ? "border-red-500" : ""
                        }`}
                      />
                      {error && (
                        <p className="text-red-500 text-sm mt-1">
                          {error.message}
                        </p>
                      )}
                    </>
                  )}
                />
              </div>
            </div>
            <div className="mt-4">
              <Controller
                name="locationType"
                control={control}
                render={({ field }) => (
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        {...field}
                        value="virtual"
                        checked={field.value === "virtual"}
                        className="mr-2"
                      />
                      Virtual
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        {...field}
                        value="physical"
                        checked={field.value === "physical"}
                        className="mr-2"
                      />
                      Physical
                    </label>
                  </div>
                )}
              />
            </div>
            {watch("locationType") === "virtual" && (
              <div className="mt-4">
                <Controller
                  name="virtualLink"
                  control={control}
                  rules={{ required: "Virtual meeting link is required" }}
                  render={({ field, fieldState: { error } }) => (
                    <motion.div
                      initial={false}
                      animate={error ? { x: [-10, 10, -10, 10, 0] } : {}}
                      transition={{ type: "spring", stiffness: 300, damping: 10 }}
                      className="space-y-2"
                    >
                      <input
                        {...field}
                        placeholder="Virtual Meeting Link"
                        className={`w-full h-12 px-3 border ${
                          error ? "border-red-500" : "border-gray-300"
                        } rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500`}
                        readOnly
                      />
                      {error && (
                        <p className="text-red-500 text-sm">{error.message}</p>
                      )}
                      {!generatedLink && (
                        <button
                          type="button"
                          onClick={generateMeetingLink}
                          className="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors"
                        >
                          Generate Meeting Link
                        </button>
                      )}
                      {generatedLink && (
                        <button
                          type="button"
                          onClick={copyToClipboard}
                          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                        >
                          Copy Link
                        </button>
                      )}
                    </motion.div>
                  )}
                />
              </div>
            )}
            {watch("locationType") === "physical" && (
              <Controller
                name="physicalAddress"
                control={control}
                rules={{ required: "Physical address is required" }}
                render={({ field, fieldState: { error } }) => (
                  <motion.div
                    initial={false}
                    animate={error ? { x: [-10, 10, -10, 10, 0] } : {}}
                    transition={{ type: "spring", stiffness: 300, damping: 10 }}
                    className="mt-4"
                  >
                    <input
                      {...field}
                      placeholder="Physical Address"
                      className={`w-full h-12 px-3 mb-4 border ${
                        error ? "border-red-500" : "border-gray-300"
                      } rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500`}
                    />
                    {error && (
                      <p className="text-red-500 text-sm mt-1">
                        {error.message}
                      </p>
                    )}
                  </motion.div>
                )}
              />
            )}
          </>
        );
      case 3:
        return (
          <>
            <h2 className="text-3xl font-semibold text-gray-800 mb-6">
              Organizer Details
            </h2>
            <Controller
              name="organizer.name"
              control={control}
              rules={{ required: "Organizer name is required" }}
              render={({ field, fieldState: { error } }) => (
                <motion.div
                  initial={false}
                  animate={error ? { x: [-10, 10, -10, 10, 0] } : {}}
                  transition={{ type: "spring", stiffness: 300, damping: 10 }}
                >
                  <input
                    {...field}
                    placeholder="Organizer Name"
                    className={`w-full h-12 px-3 mb-4 border ${
                      error ? "border-red-500" : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500`}
                  />
                  {error && (
                    <p className="text-red-500 text-sm mt-1">{error.message}</p>
                  )}
                </motion.div>
              )}
            />
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Organizer Image
              </label>
              {/* {watch("organizer.image") ? (
                <div className="relative w-32 h-32 mb-4 mx-auto">
                  <Image
                    src={
                      watch("organizer.image") && typeof watch("organizer.image") === "string"
                        ? watch("organizer.image")
                        : watch("organizer.image") instanceof File
                        ? URL.createObjectURL(watch("organizer.image") as File) // Ensure it's a File
                        : "" // Provide a fallback for null
                    }
                    alt="Organizer"
                    layout="fill"
                    objectFit="cover"
                    className="rounded-full"
                  />
                </div>
              ) : null} */}
              <FileUpload onChange={handleFileUpload} />
              {watch("organizer.image") && (
                <p>{(watch("organizer.image") as File).name}</p>
              )}
            </div>
          </>
        );
      case 4:
        return (
          <>
            <h2 className="text-3xl font-semibold text-gray-800 mb-6">
              Event Banner
            </h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Banner
              </label>
              <FileUpload onChange={handleFileUpload} />
              {watch("banner") && <p>{(watch("banner") as File).name}</p>}
            </div>
          </>
        );
      case 5:
        return (
          <>
            <h2 className="text-3xl font-semibold text-gray-800 mb-6">
              Agenda
            </h2>
            {agendaFields.map((field, index) => (
              <div
                key={field.id}
                className="mb-4 p-4 border rounded-md relative"
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xl font-semibold">
                    Agenda Item {index + 1}
                  </h3>
                  {agendaFields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeAgenda(index)}
                      className="text-red-500"
                    >
                      <FaTrash />
                    </button>
                  )}
                </div>
                <Controller
                  name={`agenda.${index}.time` as const}
                  control={control}
                  rules={{ required: "Time is required" }}
                  render={({ field, fieldState: { error } }) => (
                    <>
                      <input
                        {...field}
                        placeholder="Time"
                        className={`w-full h-10 px-3 mb-2 border ${
                          error ? "border-red-500" : "border-gray-300"
                        } rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500`}
                      />
                      {error && (
                        <p className="text-red-500 text-sm mt-1">
                          {error.message}
                        </p>
                      )}
                    </>
                  )}
                />
                <Controller
                  name={`agenda.${index}.title` as const}
                  control={control}
                  rules={{ required: "Title is required" }}
                  render={({ field, fieldState: { error } }) => (
                    <>
                      <input
                        {...field}
                        placeholder="Title"
                        className={`w-full h-10 px-3 mb-2 border ${
                          error ? "border-red-500" : "border-gray-300"
                        } rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500`}
                      />
                      {error && (
                        <p className="text-red-500 text-sm mt-1">
                          {error.message}
                        </p>
                      )}
                    </>
                  )}
                />
                <Controller
                  name={`agenda.${index}.speaker` as const}
                  control={control}
                  rules={{ required: "Speaker is required" }}
                  render={({ field, fieldState: { error } }) => (
                    <>
                      <input
                        {...field}
                        placeholder="Speaker"
                        className={`w-full h-10 px-3 mb-2 border ${
                          error ? "border-red-500" : "border-gray-300"
                        } rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500`}
                      />
                      {error && (
                        <p className="text-red-500 text-sm mt-1">
                          {error.message}
                        </p>
                      )}
                    </>
                  )}
                />
              </div>
            ))}
            <button
              type="button"
              onClick={() => appendAgenda({ time: "", title: "", speaker: "" })}
              className="flex items-center px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors"
            >
              <FaPlus className="mr-2" /> Add Agenda Item
            </button>
          </>
        );
      case 6:
        return (
          <>
            <h2 className="text-3xl font-semibold text-gray-800 mb-6">
              Sponsors
            </h2>
            <Controller
              name="sponsors"
              control={control}
              render={() => (
                <>
                  <FileUpload onChange={handleFileUpload} />
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    {sponsorsWithPreview.map((sponsor, index) => (
                      <div key={index} className="relative">
                        {sponsor.file instanceof File ? (
                          <Image
                            src={sponsor.preview}
                            alt={`Sponsor ${index + 1}`}
                            className="w-full h-20 object-contain"
                            width={20}
                            height={20}
                          />
                        ) : (
                          <p className="text-red-500">Invalid file</p>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            removeSponsor(index);
                            setSponsorsWithPreview((prev) =>
                              prev.filter((_, i) => i !== index)
                            );
                          }}
                          className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              )}
            />
          </>
        );
      case 7:
        return (
          <>
            <h2 className="text-3xl font-semibold text-gray-800 mb-6">
              Ticketing and Registration
            </h2>
            <Controller
              name="ticketType"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  className="w-full h-12 px-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="free">Free</option>
                  <option value="paid">Paid</option>
                  {/* <option value="donation">Donation-based</option> */}
                </select>
              )}
            />
            {watch("ticketType") === "paid" && ( // New condition for paid ticket
              <>
                <Controller
                  name="ticketPrice"
                  control={control}
                  rules={{ required: "Ticket price is required" }}
                  render={({ field, fieldState: { error } }) => (
                    <>
                      <input
                        type="number"
                        {...field}
                        placeholder="Ticket Price"
                        className={`w-full h-12 px-3 mb-4 border ${
                          error ? "border-red-500" : "border-gray-300"
                        } rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500`}
                      />
                      {error && (
                        <p className="text-red-500 text-sm mt-1">
                          {error.message}
                        </p>
                      )}
                    </>
                  )}
                />
                <Controller
                  name="paymentMethod"
                  control={control}
                  render={({ field }) => (
                    <select
                      {...field}
                      className="w-full h-12 px-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="">Select Payment Method</option>
                      <option value="bank">Bank Details</option>
                      <option value="upi">UPI ID</option>
                    </select>
                  )}
                />
                {watch("paymentMethod") === "bank" && ( // Bank details fields
                  <>
                    <h3 className="text-lg font-semibold mt-4">Bank Details</h3>
                    <Controller
                      name="bankAccountNumber"
                      control={control}
                      rules={{ required: "Account number is required" }}
                      render={({ field, fieldState: { error } }) => (
                        <>
                          <input
                            type="text"
                            {...field}
                            placeholder="Account Number"
                            className={`w-full h-12 px-3 mb-4 border ${
                              error ? "border-red-500" : "border-gray-300"
                            } rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500`}
                          />
                          {error && (
                            <p className="text-red-500 text-sm mt-1">
                              {error.message}
                            </p>
                          )}
                        </>
                      )}
                    />
                    {/* Add more fields for bank details as needed */}
                  </>
                )}
                {watch("paymentMethod") === "upi" && ( // UPI ID field
                  <Controller
                    name="upiId"
                    control={control}
                    rules={{ required: "UPI ID is required" }}
                    render={({ field, fieldState: { error } }) => (
                      <>
                        <input
                          type="text"
                          {...field}
                          placeholder="UPI ID"
                          className={`w-full h-12 px-3 mb-4 border ${
                            error ? "border-red-500" : "border-gray-300"
                          } rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500`}
                        />
                        {error && (
                          <p className="text-red-500 text-sm mt-1">
                            {error.message}
                          </p>
                        )}
                      </>
                    )}
                  />
                )}
              </>
            )}
            <Controller
              name="capacity"
              control={control}
              rules={{ required: "Maximum capacity is required" }}
              render={({ field, fieldState: { error } }) => (
                <>
                  <input
                    type="number"
                    {...field}
                    placeholder="Maximum Capacity"
                    className={`w-full h-12 px-3 mb-4 border ${
                      error ? "border-red-500" : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500`}
                  />
                  {error && (
                    <p className="text-red-500 text-sm mt-1">{error.message}</p>
                  )}
                </>
              )}
            />
            <Controller
              name="isPrivate"
              control={control}
              render={({ field }) => (
                <label className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    checked={field.value}
                    className="mr-2"
                  />
                  Private Event
                </label>
              )}
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      className="max-w-3xl mx-auto p-6 bg-gradient-to-br from-gray-100 to-gray-200 font-inter"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <h1 className="text-4xl font-bold text-gray-800 mb-6">
        Create New Event
      </h1>

      <div className="bg-gray-300 h-6 rounded-full mb-6 overflow-hidden relative w-full">
        <motion.div
          className="h-full bg-teal-500"
          initial={{ width: "0%" }}
          animate={progressControls}
        />
        <div className="absolute top-0 left-0 w-full h-full flex justify-between px-2">
          {[...Array(totalSteps)].map((_, index) => (
            <motion.div
              key={index}
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                index < step
                  ? "bg-teal-500 text-white"
                  : "bg-gray-400 text-gray-600"
              }`}
              initial={{ scale: 0.8 }}
              animate={{ scale: index + 1 === step ? 1.1 : 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              {index < step ? <FaCheck /> : index + 1}
            </motion.div>
          ))}
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded-lg shadow-lg"
      >
        <div className="min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ x: 300, opacity: 0, scale: 0.9 }}
              animate={{ x: 0, opacity: 1, scale: 1 }}
              exit={{ x: -300, opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
            >
              {renderStep(step)}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex justify-between mt-6">
          {step > 1 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={() => setStep((prev) => Math.max(prev - 1, 1))}
              className="px-6 py-3 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors shadow-md"
            >
              Previous
            </motion.button>
          )}
          {step < totalSteps && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={() => setStep((prev) => Math.min(prev + 1, totalSteps))}
              className="px-6 py-3 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors shadow-md"
            >
              Next
            </motion.button>
          )}
          {step === totalSteps && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="px-6 py-3 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors shadow-md"
            >
              Create Event
            </motion.button>
          )}
        </div>
      </form>
    </motion.div>
  );
};

export default EventCreationPage;
