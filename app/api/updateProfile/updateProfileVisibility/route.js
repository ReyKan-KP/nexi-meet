import UserProfile from "@models/UserProfile";
import connectDB from "@utils/database";

export async function POST(req) {
  try {
    await connectDB();

    const { id, profileVisibility } = await req.json();

    if (!id || !profileVisibility) {
      return new Response(
        JSON.stringify({ message: "ID and profile visibility are required" }),
        { status: 400 }
      );
    }

    const userProfile = await UserProfile.findOneAndUpdate(
      { user: id },
      { profileVisibility },
      { new: true }
    );

    if (!userProfile) {
      return new Response(
        JSON.stringify({ message: "UserProfile not found" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ message: "Profile visibility updated successfully" }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Server error", error: error.message }),
      { status: 500 }
    );
  }
}
