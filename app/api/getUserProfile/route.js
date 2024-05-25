import connectDB from "@utils/database";
import User from "@models/user";
import UserProfile from "@models/UserProfile";

export const GET = async (req) => {
  console.log("Starting GET request handler");
  await connectDB();
  console.log("Connected to database");

  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    const role = searchParams.get("role");

    console.log(`Received search params - email: ${email}, role: ${role}`);

    if (!email || !role) {
      console.log("Missing email or role in request");
      return new Response(
        JSON.stringify({
          success: false,
          message: "Email and role are required",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const user = await User.findOne({ email, role });
    console.log("User query result:", user);

    if (!user) {
      console.log("User not found");
      return new Response(
        JSON.stringify({ success: false, message: "User not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Find UserProfile by user ID
    // const userProfile = await UserProfile.findOne({ user: user._id }).populate(
    //   "user"
    // );
    // console.log("UserProfile query result:", userProfile);

    // if (!userProfile) {
    //   console.log("User profile not found");
    //   return new Response(
    //     JSON.stringify({ success: false, message: "User profile not found" }),
    //     { status: 404, headers: { "Content-Type": "application/json" } }
    //   );
    // }

    // console.log("User profile found:", userProfile);
    return new Response(JSON.stringify({ success: true, data: user }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.log("Error occurred:", error.message);
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
