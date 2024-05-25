// app/api/changePassword.js
import connectDB from "@utils/database";
import User from "@models/User";

export const PUT = async (req) => {
  await connectDB();

  try {
    const { userId, oldPassword, newPassword } = await req.json();

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return new Response(
        JSON.stringify({ success: false, message: "User not found" }),
        { status: 404 }
      );
    }

    // Update the user's password
    await user.updatePassword(oldPassword, newPassword);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Password updated successfully",
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { status: 400 }
    );
  }
};
