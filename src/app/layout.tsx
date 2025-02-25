import { Rubik } from "next/font/google";
import "./globals.css";
import { Metadata } from "next";

const rubik = Rubik({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TwpBot",
  description: "AI-powered document question answering system",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={rubik.className}>{children}</body>
    </html>
  );
}
