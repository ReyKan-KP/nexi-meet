const mongoose = require('mongoose');

const userEngagementSchema = new mongoose.Schema(
  {
    eventId: { type: String, required: true },
    clicks: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    rsvps: { type: Number, default: 0 },
    averageTimeSpent: { type: Number, default: 0 }, // in seconds
    searchTerms: { type: [String], default: [] },
    conversionRate: { type: Number, default: 0 }, // percentage
  },
  { timestamps: true }
);

const UserEngagement =
  mongoose.models.UserEngagement ||
  mongoose.model("UserEngagement", userEngagementSchema);

module.exports = UserEngagement;
