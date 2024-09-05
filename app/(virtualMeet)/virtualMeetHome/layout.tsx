import Sidebar from "@components/VirtualMeetComponents/Sidebar";
import React, { ReactNode } from "react";
import VirtualMeetNav from "@components/VirtualMeetComponents/VirtualMeetNav";

const VirtualMeetHomeLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <VirtualMeetNav />
      <main>
        <div className="flex">
          {/* <Sidebar /> */}
          <section className="flex min-h-screen flex-1 flex-col px-6 pb-6 pt-28 max-md:pb-14 sm:px-14">
            <div className="w-full">{children}</div>
          </section>
        </div>
      </main>
    </>
  );
};

export default VirtualMeetHomeLayout;
