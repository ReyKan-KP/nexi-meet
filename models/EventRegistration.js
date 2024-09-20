import mongoose from "mongoose";

const eventRegistrationSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    idOfEvent: { type: String, required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: { type: String, required: true },
    email: { type: String, required: true },
    registrationDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const EventRegistration =
  mongoose.models.EventRegistration ||
  mongoose.model("EventRegistration", eventRegistrationSchema);

export default EventRegistration;
