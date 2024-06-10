import * as React from "react";
import { useEffect, useState } from "react";
import { CheckCircle, Info } from "lucide-react";
import { formatDistanceToNow, parseISO } from "date-fns";

interface Note {
  id: string;
  text: string;
  date: string;
  isRead: boolean;
}

interface NotificationBellProps {
  notifications: Note[];
  markAsRead: (id: string) => void;
}

const NotificationBell: React.FC<NotificationBellProps> = ({
  notifications,
  markAsRead,
}) => {
  const [sortedNotifications, setSortedNotifications] = useState<Note[]>([]);

  useEffect(() => {
    const sorted = [...notifications].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    setSortedNotifications(sorted);
  }, [notifications]);

  const getNotificationMessage = (note: Note) => {
    const noteDate = parseISO(note.date);
    const formattedDate = noteDate.toLocaleString("default", {
      month: "long",
      day: "numeric",
    });
    const formattedTime = noteDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `You have a <u>${note.text}</u> scheduled at ${formattedTime}, ${formattedDate}`;
  };

  const getNotificationTimeAgo = (note: Note) => {
    const noteDate = parseISO(note.date);
    return formatDistanceToNow(noteDate, { addSuffix: true });
  };

  return (
    <div className="absolute right-0 mt-2 w-96 bg-white border border-gray-300 rounded-md shadow-lg max-h-96 overflow-y-auto z-10">
      <div className="p-4">
        {sortedNotifications.length === 0 ? (
          <p className="text-gray-500 text-center">No notifications</p>
        ) : (
          sortedNotifications.map((note) => (
            <div
              key={note.id}
              className={`flex justify-between items-center p-2 rounded-md mb-2 ${
                note.isRead ? "bg-gray-100" : "bg-white"
              } hover:bg-gray-50`}
            >
              <div className="flex items-start">
                <Info className="text-purple-500 mr-2" />
                <div>
                  <p
                    className="font-semibold"
                    dangerouslySetInnerHTML={{
                      __html: getNotificationMessage(note),
                    }}
                  />
                  <p className="text-gray-500 text-sm">
                    {getNotificationTimeAgo(note)}
                  </p>
                </div>
              </div>
              {!note.isRead && (
                <button
                  onClick={() => markAsRead(note.id)}
                  className="relative group"
                >
                  {/* <CheckCircle className="text-blue-500" />
                  <span className="absolute left-8 top-0 bg-black text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100">
                    Mark as read
                  </span> */}
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationBell;
