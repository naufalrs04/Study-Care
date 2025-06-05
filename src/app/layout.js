import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import MotionWrapper from './motion-wrapper';
import { PomodoroProvider } from '@/contexts/PomodoroContext';
import MainLayoutWrapper from '@/components/layout-wrapper';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Study Finder",
  description: "Study Finder Apps",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <MotionWrapper>
          <PomodoroProvider>
            <MainLayoutWrapper>
              {children}
            </MainLayoutWrapper>
          </PomodoroProvider>
        </MotionWrapper>
      </body>
    </html>
  );
}