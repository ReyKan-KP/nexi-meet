import type { Metadata } from "next";
// import "./globals.css";
import "@styles/globals.css";
import Nav from "@components/Nav";
export const metadata: Metadata = {
  title: "NexiMeet",
  description: "Elevate Your Virtual Events",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {/* <Provider> */}
          <div className="main">
            <div className="gradient"></div>
          </div>

          <main className="app">
            <Nav />
            {children}
          </main>
        {/* </Provider> */}
      </body>
    </html>
  );
}