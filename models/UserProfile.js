// models/UserProfile.js
import mongoose from "mongoose";

const userProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String },
  bio: { type: String },
  image: { type: String },
  profileVisibility: {
    type: String,
    enum: ["Public", "Private", "Friends Only"],
    default: "Public",
  },
});

userProfileSchema.pre("save", async function (next) {
  if (this.isModified("name") || this.isModified("email")) {
    await mongoose.model("User").findByIdAndUpdate(this.user, {
      name: this.name,
      email: this.email,
    });
  }
  next();
});

const UserProfile =
  mongoose.models.UserProfile ||
  mongoose.model("UserProfile", userProfileSchema);

export default UserProfile;
