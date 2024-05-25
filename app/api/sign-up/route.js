import User from "@models/user";
import UserProfile from "@models/UserProfile";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import connectDB from "@utils/database";
import dotenv from "dotenv";

dotenv.config();

export const POST = async (request) => {
  const { name, role, email, password } = await request.json();

  if (!name || !role || !email || !password) {
    return new Response(
      JSON.stringify({ message: "All fields are required" }),
      { status: 400 }
    );
  }

  try {
    await connectDB();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return new Response(JSON.stringify({ message: "User already exists" }), {
        status: 400,
      });
    }

    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS, 10);
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      name,
      role,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    const newUserProfile = new UserProfile({
      user: newUser._id,
      name,
      email,
      phoneNumber: "",
      bio: "",
      image: "",
    });

    await newUserProfile.save();

    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return new Response(
      JSON.stringify({ message: "User created successfully", token }),
      { status: 201 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Server error", error: error.message }),
      { status: 500 }
    );
  }
};
