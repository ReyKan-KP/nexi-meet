import StreamVideoProvider from "@providers/StreamClientProvider";
import { ReactNode } from "react";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import "react-datepicker/dist/react-datepicker.css";

const VirtualMeetLayout = ({ children }: Readonly<{ children: ReactNode }>) => {
  return (
    <StreamVideoProvider>
      {children}
    </StreamVideoProvider>
  );
};

export default VirtualMeetLayout;