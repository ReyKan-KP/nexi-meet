import Provider from "@components/Provider";
import StreamVideoProvider from "@providers/StreamClientProvider";
import { ReactNode } from "react";
import { Stream } from "stream";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import "react-datepicker/dist/react-datepicker.css";
const VirtualMeetLayout = ({ children }: Readonly<{ children: ReactNode }>) => {
  return (
    <main className="bg-dark-2">
      <StreamVideoProvider>{children}</StreamVideoProvider>
    </main>
  );
};

export default VirtualMeetLayout;