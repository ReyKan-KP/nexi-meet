"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import {
  Pencil,
  Trash2,
  ArrowUp,
  ArrowDown,
  X
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@components/ui/hover-card";
import Image from "next/image";
import "react-time-picker/dist/TimePicker.css";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface Note {
  _id: string;
  date: Date;
  time: string;
  text: string;
  image: string;
  name: string;
}

const CalendarWithNotes: React.FC = () => {
  const { data: session, status } = useSession();
  const [value, setValue] = useState<Date>(new Date());
  const [time, setTime] = useState<Dayjs | null>(dayjs("10:00", "HH:mm"));
  const [activeStartDate, setActiveStartDate] = useState<Date>(new Date());
  const [notes, setNotes] = useState<Note[]>([]);
  const [noteText, setNoteText] = useState<string>("");
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null);
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

  const displayCustomToast = (message: string, date: Date) => {
    toast(
      <div>
        <strong>{message}</strong>
        <div>{format(date, "EEEE, MMMM dd, yyyy 'at' h:mm a")}</div>
      </div>,
      {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        style: {
          background: "#fff",
          color: "#000",
          padding: "16px",
          borderRadius: "8px",
          boxShadow: "0 0 12px rgba(0, 0, 0, 0.1)",
        },
      }
    );
  };

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
      time: time?.format("HH:mm") ?? "10:00",
      text: noteText,
      _id: editIndex !== null ? notes[editIndex]._id : undefined,
    };

    if (editIndex !== null) {
      noteData._id = notes[editIndex]._id;
    }

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
        displayCustomToast("Note has been updated", savedNote.note.date);
      } else {
        setNotes([
          ...notes,
          { ...savedNote.note, date: new Date(savedNote.note.date) },
        ]);
        displayCustomToast("Scheduled: Catch up ", noteData.date);
      }

      setNoteText("");
      setTime(dayjs("10:00", "HH:mm"));
    } catch (error) {
      console.error("Error saving note:", error);
      toast.error("Error saving note: " + error);
    }
  };

  const confirmDeleteNote = (noteId: string) => {
    setNoteToDelete(noteId);
  };

  const deleteNote = async () => {
    if (!noteToDelete) return;

    try {
      const response = await fetch(`/api/notes/${noteToDelete}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete note");
      }

      setNotes(notes.filter((note) => note._id !== noteToDelete));
      toast.success("Note has been deleted");
      setNoteToDelete(null);
    } catch (error) {
      console.error("Error deleting note:", error);
      toast.error("Error deleting note: " + error);
    }
  };

  const handleEditNote = (index: number) => {
    if (editIndex === index) {
      setNoteText("");
      setTime(dayjs("10:00", "HH:mm"));
      setEditIndex(null);
    } else {
      setNoteText(notes[index].text);
      setTime(dayjs(notes[index].time, "HH:mm"));
      setEditIndex(index);
      setValue(notes[index].date);
    }
  };

  const handleDateClick = (date: Date) => {
    setValue(date);
    setActiveStartDate(new Date(date.getFullYear(), date.getMonth(), 1));
  };

  const toggleSortOrder = () => {
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };

  const sortedNotes = [...notes].sort((a, b) => {
    const dateComparison = a.date.getTime() - b.date.getTime();
    if (dateComparison !== 0) {
      return sortOrder === "asc" ? dateComparison : -dateComparison;
    }
    const timeComparison = a.time.localeCompare(b.time);
    return sortOrder === "asc" ? timeComparison : -timeComparison;
  });

  return (
    <div className="relative min-h-screen p-4 sm:p-6 lg:p-8 font-sans ">
      <div className="relative z-10">
        <ToastContainer />
        <div className="w-full lg:flex lg:space-x-8 mb-8">
          <div className="w-full lg:w-1/2 mb-8 lg:mb-0">
            <h2 className="text-2xl font-bold text-[#564476] mb-4">Calendar</h2>
            <Calendar
              onChange={(value) => setValue(value as Date)}
              value={value}
              activeStartDate={activeStartDate}
              onActiveStartDateChange={({ activeStartDate }) =>
                setActiveStartDate(activeStartDate || new Date())
              }
              className="calendar mb-6 p-4  rounded-lg shadow-lg"
              tileClassName={({ date, view }) =>
                view === "month" &&
                date.toDateString() === new Date().toDateString()
                  ? "bg-[#fff4a4] text-[#564476] rounded-full"
                  : ""
              }
              tileContent={({ date, view }) => {
                if (view !== "month") return null;
                const notesForDate = notes.filter(
                  (note) =>
                    format(note.date, "yyyy-MM-dd") ===
                    format(date, "yyyy-MM-dd")
                );
                if (notesForDate.length === 0) return null;
                notesForDate.sort((a, b) => a.time.localeCompare(b.time));
                return (
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <p className="text-xs cursor-pointer">📝</p>
                    </HoverCardTrigger>
                    <HoverCardContent className="bg-[#e0faf7] border-[#cee3fe]">
                      <div className="flex items-center space-x-4 mb-2">
                        <Image
                          src={session?.user?.image ?? ""}
                          alt={session?.user?.name ?? ""}
                          className="w-10 h-10 rounded-full"
                          width={40}
                          height={40}
                        />
                        <div>
                          <p className="text-sm font-semibold text-[#564476]">
                            {session?.user?.name}
                          </p>
                        </div>
                      </div>
                      <ol className="list-decimal list-inside text-left px-4">
                        {notesForDate.map((note, index) => (
                          <li key={index} className="text-[#564476]">
                            <span className="text-s">
                              {note.text} at {note.time}
                            </span>
                          </li>
                        ))}
                      </ol>
                    </HoverCardContent>
                  </HoverCard>
                );
              }}
            />

            <p className="text-[#564476] mb-4">
              Selected Date: {format(value, "MMMM d, yyyy")}
            </p>
            <div className="bg-white/70 p-4 rounded-lg shadow-md">
              <h3 className="text-md font-semibold text-[#564476] mb-2">
                Select Time
              </h3>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <TimePicker
                  value={time}
                  onChange={setTime}
                  className="mb-4 w-full"
                />
              </LocalizationProvider>
              <h3 className="text-md font-semibold text-[#564476] mb-2">
                {editIndex !== null ? "Edit Note" : "Add Note"}
              </h3>
              <textarea
                className="w-full rounded-md border border-[#cee3fe] bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#f0e3ff] focus:ring-offset-2 mb-2 transition-all duration-300 ease-in-out"
                rows={3}
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Enter your note here..."
              ></textarea>

              <button
                onClick={addOrEditNote}
                className="inline-flex items-center justify-center rounded-md bg-[#f0e3ff] px-4 py-2 font-semibold text-[#564476] hover:bg-[#e0faf7] transition-all duration-300 ease-in-out transform hover:scale-105 shadow-md"
              >
                {editIndex !== null ? "Update Note" : "Add Note"}
              </button>
            </div>
          </div>
          <div className="w-full lg:w-1/2">
            <h2 className="text-2xl font-bold text-[#564476] mb-4 flex items-center">
              Notes Table
              <button
                onClick={toggleSortOrder}
                className="ml-2 text-[#564476] hover:text-[#f0e3ff] transition-colors duration-300"
              >
                {sortOrder === "asc" ? <ArrowUp /> : <ArrowDown />}
              </button>
            </h2>
            <div className="bg-[#f0e3ff] rounded-lg shadow-lg overflow-x-auto">
              <table className="w-full divide-y divide-[#cee3fe]">
                <thead className="bg-[#e0faf7]">
                  <tr>
                    <th
                      scope="col"
                      className="px-3 sm:px-4 md:px-6 py-3 text-left text-xs font-medium text-[#564476] uppercase tracking-wider w-1/4 sm:w-1/5"
                    >
                      Date
                    </th>
                    <th
                      scope="col"
                      className="px-3 sm:px-4 md:px-6 py-3 text-left text-xs font-medium text-[#564476] uppercase tracking-wider w-1/6 sm:w-1/6"
                    >
                      Time
                    </th>
                    <th
                      scope="col"
                      className="px-3 sm:px-4 md:px-6 py-3 text-left text-xs font-medium text-[#564476] uppercase tracking-wider"
                    >
                      Note
                    </th>
                    <th
                      scope="col"
                      className="px-3 sm:px-4 md:px-6 py-3 text-center text-xs font-medium text-[#564476] uppercase tracking-wider w-1/6 sm:w-1/8"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white/70 divide-y divide-[#cee3fe]">
                  {sortedNotes.map((note, index) => (
                    <tr
                      key={note._id}
                      onClick={() => handleDateClick(note.date)}
                      className="hover:bg-[#d5fbe2] cursor-pointer transition-colors duration-300"
                    >
                      <td className="px-3 sm:px-4 md:px-6 py-4 whitespace-nowrap text-[#564476] text-sm">
                        {format(note.date, "MMM d, yyyy")}
                      </td>
                      <td className="px-3 sm:px-4 md:px-6 py-4 whitespace-nowrap text-[#564476] text-sm">
                        {note.time}
                      </td>
                      <td className="px-3 sm:px-4 md:px-6 py-4 text-[#564476] text-sm">
                        <div className="truncate max-w-xs sm:max-w-sm md:max-w-md">
                          {note.text}
                        </div>
                      </td>
                      <td className="px-3 sm:px-4 md:px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex justify-center space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditNote(index);
                            }}
                            className={`text-${
                              editIndex === index ? "[#fff4a4]" : "[#564476]"
                            } hover:text-[#8d6ffa] transition-colors duration-300`}
                          >
                            {editIndex === index ? <X /> : <Pencil />}
                          </button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  confirmDeleteNote(note._id);
                                }}
                                className="text-[#564476] hover:text-[#ff0062] transition-colors duration-300"
                              >
                                <Trash2 />
                              </button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-[#e0faf7] rounded-lg p-4 shadow-lg">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="text-[#564476]">
                                  Are you sure you want to delete this note?
                                </AlertDialogTitle>
                                <AlertDialogDescription className="text-[#564476]">
                                  This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel asChild>
                                  <button
                                    className="p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#f0e3ff] transition-all duration-300 ease-in-out"
                                    title="Cancel"
                                  >
                                    <X className="text-[#564476]" />
                                  </button>
                                </AlertDialogCancel>
                                <AlertDialogAction asChild>
                                  <button
                                    onClick={deleteNote}
                                    className="p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#fff4a4] transition-all duration-300 ease-in-out"
                                    title="Delete"
                                  >
                                    <Trash2 className="text-[#564476]" />
                                  </button>
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarWithNotes;
