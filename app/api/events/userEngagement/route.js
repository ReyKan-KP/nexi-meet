import UserEngagement from "@/models/UserEngagement";
import connectDB from "@utils/database";

export async function POST(req) {
  await connectDB();

  const { eventId, action, searchTerm, timeSpent } = await req.json(); // Updated to use req.json()

  try {
    let engagement = await UserEngagement.findOne({ eventId });

    if (!engagement) {
      engagement = new UserEngagement({ eventId });
    }

    const initialEngagement = engagement.toObject(); // Store initial state

    switch (action) {
      case "click":
        engagement.clicks += 1; // Increment clicks for card click
        break;
      case "view":
        engagement.views += 1; // Increment views for modal view
        break;
      case "rsvp":
        engagement.rsvps += 1;
        engagement.conversionRate =
          (engagement.rsvps / engagement.views) * 100 || 0; // Update conversion rate
        break;
      case "timeSpent":
        const totalViews = engagement.views || 1; // Avoid division by zero
        engagement.averageTimeSpent =
          (engagement.averageTimeSpent * (totalViews - 1) + timeSpent) /
          totalViews;
        break;
      case "search":
        if (searchTerm && !engagement.searchTerms.includes(searchTerm)) {
          engagement.searchTerms.push(searchTerm);
        }
        break;
      // Add more cases as needed
    }

    // Save only if there are changes
    if (JSON.stringify(engagement) !== JSON.stringify(initialEngagement)) {
      await engagement.save();
    }

    return new Response(JSON.stringify(engagement), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to update engagement data" }),
      { status: 500 }
    );
  }
}
export async function GET(req) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const eventId = searchParams.get("eventId");

  try {
    if (!eventId) {
      return new Response(JSON.stringify({ error: "eventId is required" }), {
        status: 400,
      });
    }

    const engagement = await UserEngagement.findOne({ eventId });

    if (!engagement) {
      return new Response(
        JSON.stringify({ error: "No engagement data found" }),
        {
          status: 404,
        }
      );
    }

    return new Response(JSON.stringify(engagement), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to retrieve engagement data" }),
      { status: 500 }
    );
  }
}