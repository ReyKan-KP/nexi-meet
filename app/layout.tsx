import type { Metadata } from "next";
// import "./globals.css";
import "@styles/globals.css";
import Nav from "@components/Nav";
import Footer from "@components/Footer";
import Head from "next/head";
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
      <script defer src="https://app.fastbots.ai/embed.js" data-bot-id="clxnpy2ix00iyr9bc4wxgrbcd"></script>

        {/* <Provider> */}
        <div className="main">
          <div className="gradient"></div>
        </div>

        <main className="app">
          <Nav />
          {children}
          <Footer />
        </main>

        {/* </Provider> */}
      </body>
    </html>
  );
}
