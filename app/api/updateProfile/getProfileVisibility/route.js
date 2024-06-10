// app/api/updateProfile/getProfileVisibility/route.js
import UserProfile from "@models/UserProfile";
import connectDB from "@utils/database";

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("id");

    if (!userId) {
      return new Response(JSON.stringify({ message: "ID is required" }), {
        status: 400,
      });
    }

    const userProfile = await UserProfile.findOne({ user: userId });

    if (!userProfile) {
      return new Response(
        JSON.stringify({ message: "UserProfile not found" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ profileVisibility: userProfile.profileVisibility }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Server error", error: error.message }),
      { status: 500 }
    );
  }
}
