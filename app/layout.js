import * as React from "react";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Customer Service AI / Chatbot",
  description: "Customer Service AI / Chatbot",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href={inter.className} />
      </head>
      <body>{children}</body>
    </html>
  );
}
