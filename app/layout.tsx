
import type { Metadata } from "next";
import "@styles/globals.css";
import Nav from "@components/Nav";
import Footer from "@components/Footer";
import ToastContainerComponent from "@components/ToastContainerComponent";
import Provider from "@components/Provider";

import { ThemeProvider } from "@components/ui/theme-provider";

export const metadata: Metadata = {
  title: "NexiMeet",
  description: "Elevate Your Virtual Events",
};

export default function RootLayout({
  children,
  session,
}: Readonly<{
  children: React.ReactNode;
  session: any;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/images/nexi_meet.ico" />
      </head>
      <body>
        <Provider session={session}>
          {" "}
          <script
            defer
            src="https://app.fastbots.ai/embed.js"
            data-bot-id="clxnpy2ix00iyr9bc4wxgrbcd"
          ></script>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <div className="main">
              <div className="gradient"></div>
            </div>
            <main className="app">
              <ToastContainerComponent />
              <Nav />
              {children}
              <Footer />
            </main>
          </ThemeProvider>
        </Provider>
      </body>
    </html>
  );
}
