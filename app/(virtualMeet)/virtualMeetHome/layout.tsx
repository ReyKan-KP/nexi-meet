import React, { ReactNode } from "react";
import VirtualMeetNav from "@components/VirtualMeetComponents/VirtualMeetNav";

const VirtualMeetHomeLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <VirtualMeetNav />
      <main className="bg-gradient-to-b from-teal-300/20 to-blue-300/20 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="w-full">{children}</div>
        </div>
      </main>
    </>
  );
};

export default VirtualMeetHomeLayout;
