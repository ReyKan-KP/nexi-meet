import type { Metadata } from "next";
import "@styles/globals.css";
import Nav from "@components/Nav";
import Footer from "@components/Footer";
import Head from "next/head";
import ToastContainerComponent from "@components/ToastContainerComponent";

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
      <Head>
        <link rel="icon" href="/images/favicon.ico" />
      </Head>
      <body>
        <div className="main">
          <div className="gradient"></div>
        </div>
        <main className="app">
          <ToastContainerComponent />
          <Nav />
          {children}
          <Footer />
        </main>
      </body>
    </html>
  );
}
