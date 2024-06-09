import Note from "@models/Note";
import connectDB from "@utils/database";

export async function POST(req) {
  try {
    await connectDB();

    const { user, userName, userEmail, date, time, text } = await req.json();

    if (!user || !userName || !userEmail || !date || !time || !text) {
      console.log("POST request: Missing required fields");
      return new Response(
        JSON.stringify({ message: "All fields are required" }),
        { status: 400 }
      );
    }

    const newNote = new Note({
      user,
      userName,
      userEmail,
      date,
      time,
      text,
    });
    console.log("New note object:", newNote);

    await newNote.save();

    console.log("Note saved successfully");

    return new Response(
      JSON.stringify({ message: "Note created successfully", note: newNote }),
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

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("user");

    if (!userId) {
      console.log("GET request: User ID is required");
      return new Response(JSON.stringify({ message: "User ID is required" }), {
        status: 400,
      });
    }

    console.log("GET request: Fetching notes for user ID", userId);

    const notes = await Note.find({ user: userId });

    console.log("GET request: Notes fetched successfully", notes);

    return new Response(JSON.stringify(notes), { status: 200 });
  } catch (error) {
    console.error("GET request error:", error);
    return new Response(
      JSON.stringify({ message: "Server error", error: error.message }),
      { status: 500 }
    );
  }
}
