"use client";

import { ReactNode, useEffect, useState } from "react";
import { StreamVideoClient, StreamVideo } from "@stream-io/video-react-sdk";
import { useSession } from "next-auth/react";
import Loader from "@components/ui/Loader";

const API_KEY = process.env.NEXT_PUBLIC_STREAM_API_KEY;

const StreamVideoProvider = ({ children }: { children: ReactNode }) => {
  const [videoClient, setVideoClient] = useState<StreamVideoClient>();
  const { data: session, status } = useSession();

  useEffect(() => {
    const setupVideoClient = async () => {
      if (status !== "authenticated" || !session?.user) return;
      if (!API_KEY) throw new Error("Stream API key is missing");

      try {
        const response = await fetch("/api/getStreamToken", {
          method: "POST",
        });
        const token = await response.text();

        const client = new StreamVideoClient({
          apiKey: API_KEY,
          user: {
            id: session.user.id,
            name: session.user.name || session.user.id,
            image: session.user.image || "",
          },
          tokenProvider: () => Promise.resolve(token),
        });

        setVideoClient(client);
      } catch (error) {
        console.error("Failed to setup StreamVideoClient", error);
      }
    };

    setupVideoClient();
  }, [session, status]);

  if (!videoClient) return <Loader />;

  return <StreamVideo client={videoClient}>{children}</StreamVideo>;
};

export default StreamVideoProvider;
