import Note from "@models/Note";
import connectDB from "@utils/database";

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    await Note.findByIdAndDelete(params.id);

    return new Response("Note deleted successfully", { status: 200 });
  } catch (error) {
    return new Response("Error deleting prompt", { status: 500 });
  }
}
