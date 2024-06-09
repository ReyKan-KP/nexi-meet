import type { Metadata } from "next";
import "@styles/globals.css";
import Nav from "@components/Nav";
import Footer from "@components/Footer";
import Head from "next/head";
import ToastContainerComponent from "@components/ToastContainerComponent";
import Provider from "@components/Provider";
import { ThemeProvider } from "@components/ui/theme-provider";
 

export const metadata: Metadata = {
  title: "NexiMeet",
  description: "Elevate Your Virtual Events",
};

export default function RootLayout({
  children,
  session, // Add the session prop here
}: Readonly<{
  children: React.ReactNode;
  session: any; // Define the session prop
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/images/nexi_meet.ico" />
      </head>
      <body>
        <Provider session={session}>
          {" "}
          {/* Pass the session prop to Provider */}
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
