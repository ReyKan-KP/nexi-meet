import Provider from "@components/Provider";
import StreamVideoProvider from "@providers/StreamClientProvider";
import { ReactNode } from "react";
import { Stream } from "stream";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import "react-datepicker/dist/react-datepicker.css";
const VirtualMeetLayout = ({
  children,
  session,
}: {
  children: ReactNode;
  session: any;
}) => {
  return (
    <main className="bg-dark-2">
      <Provider session={session}>
        <StreamVideoProvider>{children}</StreamVideoProvider>
      </Provider>
    </main>
  );
};

export default VirtualMeetLayout;