"use client";
import { useState } from "react";
import {
  CallControls,
  CallParticipantsList,
  CallStatsButton,
  CallingState,
  PaginatedGridLayout,
  SpeakerLayout,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Users, LayoutList } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import Loader from "@components/ui/Loader";
import EndCallButton from "@components/VirtualMeetComponents/EndCallButton";
import { cn } from "@lib/utils";
import MainPanel from "@components/VirtualMeetComponents/Chat/MainPanel";

type CallLayoutType = "grid" | "speaker-left" | "speaker-right";

const MeetingRoom = () => {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const isPersonalRoom = !!searchParams.get("personal");
  const router = useRouter();
  const [layout, setLayout] = useState<CallLayoutType>("speaker-left");
  const [showParticipants, setShowParticipants] = useState(false);
  const { useCallCallingState } = useCallStateHooks();

  // for more detail about types of CallingState see: https://getstream.io/video/docs/react/ui-cookbook/ringing-call/#incoming-call-panel
  const callingState = useCallCallingState();
  // console.log("From meeting room :",searchParams);

  if (callingState !== CallingState.JOINED) return <Loader />;

  const CallLayout = () => {
    switch (layout) {
      case "grid":
        return <PaginatedGridLayout />;
      case "speaker-right":
        return <SpeakerLayout participantsBarPosition="left" />;
      default:
        return <SpeakerLayout participantsBarPosition="right" />;
    }
  };

  // console.log("Meeting room",id)

  return (

    <section className="relative h-screen w-full overflow-hidden pt-4 text-white">
    <div className="relative flex h-full">
      {/* Video layout */}
      <div className="flex-1 flex items-center justify-center">
        <div className="max-w-[1000px]">
          <CallLayout />
        </div>
        <div
          className={cn("h-[calc(100vh-86px)] hidden ml-2", {
            "show-block": showParticipants,
          })}
        >
          <CallParticipantsList onClose={() => setShowParticipants(false)} />
        </div>
      </div>

      {/* Chat sidebar */}
      <div className="w-80 md:w-80 bg-gray-800 border-1 border-gray-700 h-screen">
        <MainPanel id={id}/>
      </div>
    </div>

    {/* Call controls */}
    <div className="fixed bottom-0 flex w-full items-center justify-center gap-5">
      <CallControls onLeave={() => router.push(`/virtualMeetHome`)} />

      <DropdownMenu>
        <div className="flex items-center">
          <DropdownMenuTrigger className="cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]  ">
            <LayoutList size={20} className="text-white" />
          </DropdownMenuTrigger>
        </div>
        <DropdownMenuContent className="border-dark-1 bg-dark-1 text-white">
          {["Grid", "Speaker-Left", "Speaker-Right"].map((item, index) => (
            <div key={index}>
              <DropdownMenuItem
                onClick={() =>
                  setLayout(item.toLowerCase() as CallLayoutType)
                }
              >
                {item}
              </DropdownMenuItem>
              <DropdownMenuSeparator className="border-dark-1" />
            </div>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <CallStatsButton />

      <button onClick={() => setShowParticipants((prev) => !prev)}>
        <div className=" cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]  ">
          <Users size={20} className="text-white" />
        </div>
      </button>

      {!isPersonalRoom && <EndCallButton />}
    </div>
  </section>
  );
};

export default MeetingRoom;
