"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import { ArrowUp, ArrowDown, Pencil, Trash2, X } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";

interface Note {
  _id: string;
  date: Date;
  time: string;
  text: string;
}

const UserDashboard: React.FC = () => {
  const { data: session, status } = useSession();
  const [notes, setNotes] = useState<Note[]>([]);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

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
    <div className="container mx-auto px-4 py-6">
      <ToastContainer />

      <div className="mt-6">
        <h2 className="text-xl font-bold text-teal-700 mb-4 flex items-center">
          Upcoming Notes
          <button
            onClick={toggleSortOrder}
            className="ml-2 text-teal-600 hover:text-teal-800"
          >
            {sortOrder === "asc" ? <ArrowUp /> : <ArrowDown />}
          </button>
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Note
                </th>
                <th className="relative px-6 py-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedNotes.map((note, index) => (
                <tr key={note._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {format(note.date, "MMMM d, yyyy")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{note.time}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{note.text}</td>
                  {/* <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <button className="text-teal-500 hover:text-teal-700">
                      <Pencil />
                    </button>
                    <button className="text-red-500 hover:text-red-700">
                      <Trash2 />
                    </button>
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
