import connectDB from "@utils/database";
export const GET = async (req, res) => {
  try {
    // Attempt to connect to the database
    await connectDB();

    // Send a response confirming the connection
    return new Response(JSON.stringify({ message: "Connected to MongoDB" }), {
      status: 201,
    });
  } catch (error) {
    // Handle any errors that occur during the connection
    return new Response(
      JSON.stringify({
        message: "MongoDB Connection Failed",
        error: error.message,
      }),
      { status: 500 }
    );
  }
};
