"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { StreamCall, StreamTheme } from "@stream-io/video-react-sdk";
import { useParams } from "next/navigation";
import { Loader } from "lucide-react";

import { useGetCallById } from "@hooks/useGetCallById";
import Alert from "@components/ui/Alert";
import MeetingSetup from "@/components/VirtualMeetComponents/MeetingSetup";
import MeetingRoom from "@/components/VirtualMeetComponents/MeetingRoom";

const MeetingPage = () => {
  const { id } = useParams();
  const { data: session, status } = useSession();
  const { call, isCallLoading } = useGetCallById(id);
  const [isSetupComplete, setIsSetupComplete] = useState(false);

  if (status === "loading" || isCallLoading) return <Loader />;

  if (!call) {
    return (
      <p className="text-center text-3xl font-bold text-white">
        Call Not Found
      </p>
    );
  }

  const user = session?.user;
  const notAllowed =
    call.type === "invited" &&
    (!user || !call.state.members.find((m: { user: { id: string; }; }) => m.user.id === user.id));

  if (notAllowed) {
    return <Alert title="You are not allowed to join this meeting" />;
  }

  return (
    <main className="h-screen w-full">
      <StreamCall call={call}>
        <StreamTheme>
          {!isSetupComplete ? (
            <MeetingSetup setIsSetupComplete={setIsSetupComplete} />
          ) : (
              <MeetingRoom />
          )}
        </StreamTheme>
      </StreamCall>
    </main>
  );
};

export default MeetingPage;
