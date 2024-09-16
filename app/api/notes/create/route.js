import connectDB from "@utils/database";
import Note from "@models/Note";

export async function POST(req) {
  try {
    await connectDB();
    const { userId, userName, userEmail, date, time, text, link } = req.body;
    const note = await Note.create({
      user: userId,
      userName,
      userEmail,
      date,
      time,
      text,
      link,
    });

    return new Response(
      JSON.stringify({ message: "Note created successfully", note }),
      { status: 201 }
    );
  } catch (error) {
    console.error("POST request error:", error);
    return new Response(
      JSON.stringify({ message: "Server error", error: error.message }),
      { status: 500 }
    );
  }
}
