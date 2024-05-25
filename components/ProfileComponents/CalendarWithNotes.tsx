"use client";
import { useEffect, useState, MouseEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import { Pencil } from "lucide-react";
import { Trash2 } from "lucide-react";
import { NotebookPen } from "lucide-react";

interface Note {
  _id: string;
  date: Date;
  text: string;
}

const CalendarWithNotes: React.FC = () => {
  const { data: session, status } = useSession();
  const [value, setValue] = useState<Date>(new Date());
  const [notes, setNotes] = useState<Note[]>([]);
  const [noteText, setNoteText] = useState<string>("");
  const [hoveredNote, setHoveredNote] = useState<string | null>(null);
  const [hoverPosition, setHoverPosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      const userId = session.user.id;
      const fetchNotes = async () => {
        try {
          const response = await fetch(`/api/notes?user=${userId}`);
          if (!response.ok) {
            throw new Error("Failed to fetch notes");
          }
          const data = await response.json();
          setNotes(data);
        } catch (error) {
          console.error("Error fetching notes:", error);
        }
      };

      fetchNotes();
    }
  }, [status, session]);

  const addOrEditNote = async () => {
    if (noteText.trim() === "") return;

    const userId = session?.user?.id;
    const userName = session?.user?.name;
    const userEmail = session?.user?.email;

    const noteData = {
      user: userId,
      userName: userName,
      userEmail: userEmail,
      date: value,
      text: noteText,
    };

    try {
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(noteData),
      });

      if (!response.ok) {
        throw new Error("Failed to save note");
      }

      const savedNote = await response.json();

      if (editIndex !== null) {
        const updatedNotes = [...notes];
        updatedNotes[editIndex] = savedNote.note;
        setNotes(updatedNotes);
        setEditIndex(null);
      } else {
        setNotes([...notes, savedNote.note]);
      }

      setNoteText("");
    } catch (error) {
      console.error("Error saving note:", error);
    }
  };

  const deleteNote = async (noteId: string) => {
    try {
      const response = await fetch(`/api/notes/${noteId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete note");
      }

      setNotes(notes.filter((note) => note._id !== noteId));
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  const handleMouseEnter = (date: Date, e: React.MouseEvent) => {
    const note = notes.find(
      (note) => format(note.date, "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
    );
    if (note) {
      setHoveredNote(note.text);
      setHoverPosition({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseLeave = () => {
    setHoveredNote(null);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (hoveredNote) {
      setHoverPosition({ x: e.clientX, y: e.clientY });
    }
  };

  const handleEditNote = (index: number) => {
    setNoteText(notes[index].text);
    setEditIndex(index);
    setValue(notes[index].date);
  };

  return (
    <div className="flex flex-col items-center" onMouseMove={handleMouseMove}>
      <div className="flex flex-row items-start mb-4 space-x-8">
        <div className="flex flex-col items-center">
          <h2 className="text-lg font-bold text-black mb-2">Calendar</h2>
          <Calendar
            onChange={setValue}
            value={value}
            className="mb-4"
            tileContent={({ date, view }) =>
              view === "month" &&
              notes.some(
                (note) =>
                  format(note.date, "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
              ) ? (
                <p
                  className="text-xs"
                  onMouseEnter={(e) => handleMouseEnter(date, e)}
                  onMouseLeave={handleMouseLeave}
                >
                  📝
                </p>
              ) : null
            }
          />
          <p className="text-gray-700">
            Selected Date: {format(value, "MMMM d, yyyy")}
          </p>
          <div className="mt-4">
            <h3 className="text-md font-semibold text-black mb-2">
              {editIndex !== null ? "Edit Note" : "Add Note"}
            </h3>
            <textarea
              className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 mb-2"
              rows={3}
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
            ></textarea>
            <button
              onClick={addOrEditNote}
              className="inline-flex items-center justify-center rounded-md bg-black px-3.5 py-2.5 font-semibold leading-7 text-white hover:bg-black/80"
            >
              {editIndex !== null ? "Update Note" : "Add Note"}
            </button>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <h2 className="text-lg font-bold text-black mb-2">Notes Table</h2>
          <table className="w-full table-auto border-collapse border border-gray-200">
            <thead>
              <tr>
                <th className="border border-gray-300 px-4 py-2">Date</th>
                <th className="border border-gray-300 px-4 py-2">Note</th>
                <th className="border border-gray-300 px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {notes.map((note, index) => (
                <tr key={note._id}>
                  <td className="border border-gray-300 px-4 py-2">
                    {format(note.date, "MMMM d, yyyy")}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {note.text}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 flex space-x-2">
                    <button
                      onClick={() => handleEditNote(index)}
                      className="text-blue-500 hover:underline"
                    >
                      <Pencil />
                    </button>

                    <button
                      onClick={() => deleteNote(note._id)}
                      className="text-red-500 hover:underline"
                    >
                      <Trash2 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {hoveredNote && (
        <div
          className="absolute bg-white border border-gray-300 p-2 rounded shadow-lg"
          style={{ top: hoverPosition.y + 20, left: hoverPosition.x + 20 }}
        >
          {hoveredNote}
        </div>
      )}
    </div>
  );
};

export default CalendarWithNotes;
