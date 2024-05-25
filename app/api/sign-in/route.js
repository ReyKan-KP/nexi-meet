import User from "@models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import connectDB from "@utils/database";
import dotenv from "dotenv";

dotenv.config();

export const POST = async (request) => {
  try {
    const { email, password, role } = await request.json();

    if (!email || !password || !role) {
      return new Response(
        JSON.stringify({ message: "All fields are required" }),
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findOne({ email });
    if (!user) {
      return new Response(
        JSON.stringify({ message: "Invalid email or password" }),
        { status: 401 }
      );
    }

    if (user.role !== role) {
      return new Response(JSON.stringify({ message: "Role mismatch" }), {
        status: 403,
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return new Response(
        JSON.stringify({ message: "Invalid email or password" }),
        { status: 401 }
      );
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    return new Response(
      JSON.stringify({ message: "Sign in successful", token }),
      {
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Server error", error: error.message }),
      { status: 500 }
    );
  }
};
