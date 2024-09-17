import mongoose from "mongoose";

const agendaItemSchema = new mongoose.Schema(
  {
    time: { type: String, required: true },
    title: { type: String, required: true },
    speaker: { type: String, required: true },
  },
  { _id: false }
);

const sponsorSchema = new mongoose.Schema(
  {
    fileUrl: { type: String, required: true },
  },
  { _id: false }
);

const eventSchema = new mongoose.Schema(
  {
    eventName: { type: String, required: true },
    eventDescription: { type: String, required: true },
    eventCategory: { type: String, required: true },
    startDate: { type: Date, required: true },
    startTime: { type: String, required: true },
    endDate: { type: Date, required: true },
    endTime: { type: String, required: true },
    locationType: {
      type: String,
      enum: ["virtual", "physical"],
      required: true,
    },
    virtualLink: { type: String },
    physicalAddress: { type: String },
    organizer: {
      name: { type: String, required: true },
      imageUrl: { type: String },
    },
    bannerUrl: { type: String },
    agenda: [agendaItemSchema],
    sponsors: [sponsorSchema],
    ticketType: {
      type: String,
      enum: ["free", "paid", "donation"],
      required: true,
    },
    capacity: { type: Number, required: true },
    isPrivate: { type: Boolean, default: false },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    userName: { type: String, required: true },
    userEmail: { type: String, required: true },
  },
  { timestamps: true }
);

const Event = mongoose.models.Event || mongoose.model("Event", eventSchema);

export default Event;
