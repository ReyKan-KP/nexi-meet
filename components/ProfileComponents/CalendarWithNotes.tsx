"use client";
import { useEffect, useState, MouseEvent } from "react";
import { useRouter } from "next/navigation";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import { Pencil, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Note {
  _id: string;
  date: Date;
  text: string;
}

const CalendarWithNotes: React.FC = () => {
  const { data: session, status } = useSession();
  const [value, setValue] = useState<Date>(new Date());
  const [activeStartDate, setActiveStartDate] = useState<Date>(new Date());
  const [notes, setNotes] = useState<Note[]>([]);
  const [noteText, setNoteText] = useState<string>("");
  const [hoveredNote, setHoveredNote] = useState<string | null>(null);
  const [hoverPosition, setHoverPosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
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
          const parsedData = data.map((note: any) => ({
            ...note,
            date: new Date(note.date),
          }));
          setNotes(parsedData);
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
        updatedNotes[editIndex] = {
          ...savedNote.note,
          date: new Date(savedNote.note.date),
        };
        setNotes(updatedNotes);
        setEditIndex(null);
      } else {
        setNotes([
          ...notes,
          { ...savedNote.note, date: new Date(savedNote.note.date) },
        ]);
      }

      setNoteText("");
      toast.success("Note saved successfully!");
    } catch (error) {
      console.error("Error saving note:", error);
      toast.error("Error saving note: " + error);
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
      toast.success("Note deleted successfully!");
    } catch (error) {
      console.error("Error deleting note:", error);
      toast.error("Error deleting note: " + error);
    }
  };

  const handleMouseEnter = (date: Date, e: React.MouseEvent) => {
    const note = notes.find(
      (note) => format(note.date, "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
    );
    if (note) {
      setHoveredNote(note.text);
      setHoverPosition({ x: e.clientX , y: e.clientY });
    }
  };

  const handleMouseLeave = () => {
    setHoveredNote(null);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (hoveredNote) {
      setHoverPosition({ x: e.clientX , y: e.clientY });
    }
  };

  const handleEditNote = (index: number) => {
    setNoteText(notes[index].text);
    setEditIndex(index);
    setValue(notes[index].date);
  };

  const handleDateClick = (date: Date) => {
    setValue(date);
    setActiveStartDate(new Date(date.getFullYear(), date.getMonth(), 1));
  };

  const toggleSortOrder = () => {
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };

  const sortedNotes = [...notes].sort((a, b) => {
    if (sortOrder === "asc") {
      return a.date.getTime() - b.date.getTime();
    } else {
      return b.date.getTime() - a.date.getTime();
    }
  });

  return (
    <div
      className="flex flex-col items-center p-4 sm:p-6 lg:p-8 relative"
      onMouseMove={handleMouseMove}
    >
      <ToastContainer />
      <div className="w-full lg:flex lg:space-x-8 mb-8">
        <div className="w-full lg:w-1/2 mb-8 lg:mb-0">
          <h2 className="text-2xl font-bold text-black mb-4">Calendar</h2>
          <Calendar
            onChange={(value) => setValue(value as Date)}
            value={value}
            activeStartDate={activeStartDate}
            onActiveStartDateChange={({ activeStartDate }) =>
              setActiveStartDate(activeStartDate || new Date())
            }
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
          <p className="text-gray-700 mb-4">
            Selected Date: {format(value, "MMMM d, yyyy")}
          </p>
          <div>
            <h3 className="text-md font-semibold text-black mb-2">
              {editIndex !== null ? "Edit Note" : "Add Note"}
            </h3>
            <textarea
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 mb-2"
              rows={3}
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
            ></textarea>
            <button
              onClick={addOrEditNote}
              className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-700"
            >
              {editIndex !== null ? "Update Note" : "Add Note"}
            </button>
          </div>
        </div>
        <div className="w-full lg:w-1/2">
          <h2 className="text-2xl font-bold text-black mb-4 flex items-center">
            Notes Table
            <button
              onClick={toggleSortOrder}
              className="ml-2 text-indigo-600 hover:text-indigo-800"
            >
              {sortOrder === "asc" ? <ArrowUp /> : <ArrowDown />}
            </button>
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Date
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Note
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedNotes.map((note, index) => (
                  <tr
                    key={note._id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleDateClick(note.date)}
                  >
                    <td className="border border-gray-300 px-4 py-2">
                      {format(note.date, "MMMM d, yyyy")}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {note.text}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 flex space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditNote(index);
                        }}
                        className="text-indigo-500 hover:text-indigo-700"
                      >
                        <Pencil />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNote(note._id);
                        }}
                        className="text-red-500 hover:text-red-700"
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
      </div>
      {hoveredNote && (
        <div
          className="absolute bg-white border border-gray-300 p-2 rounded shadow-lg"
          style={{ top: hoverPosition.y+20, left: hoverPosition.x+20 }}
        >
          {hoveredNote}
        </div>
      )}
    </div>
  );
};

export default CalendarWithNotes;
