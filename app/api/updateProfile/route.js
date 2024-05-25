// app/api/updateProfile/route.js
import User from "@models/user";
import UserProfile from "@models/UserProfile";
import connectDB from "@utils/database";

export async function POST(req) {
  try {
    await connectDB();

    const { id, name, email, phoneNumber, bio, image } = await req.json();

    if (!id || !name || !email) {
      return new Response(
        JSON.stringify({ message: "ID, name, and email are required" }),
        { status: 400 }
      );
    }

    const userProfile = await UserProfile.findOneAndUpdate(
      { user: id },
      { name, email, phoneNumber, bio, image },
      { new: true }
    );

    if (!userProfile) {
      return new Response(
        JSON.stringify({ message: "UserProfile not found" }),
        { status: 404 }
      );
    }

    await User.findByIdAndUpdate(id, { name, email });

    return new Response(
      JSON.stringify({ message: "Profile updated successfully" }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Server error", error: error.message }),
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("id");

    if (!userId) {
      return new Response(JSON.stringify({ message: "User ID is required" }), {
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

    return new Response(JSON.stringify(userProfile), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Server error", error: error.message }),
      { status: 500 }
    );
  }
}
