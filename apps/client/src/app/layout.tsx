import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import Header from "@/components/section/header";

const interSans = Inter({
  variable: "--font-inter-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "SkillMatch - AI-Powered Job Match Platform",
    template: "%s - SkillMatch",
  },
  description:
    "SkillMatch is an AI-powered job match platform that connects job seekers with suitable job opportunities.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.JSX.Element {
  return (
    <html lang="en">
      <body className={`${interSans.variable} antialiased`}>
        <main>
          <Header />
          {children}
          <Toaster />
        </main>
      </body>
    </html>
  );
}
