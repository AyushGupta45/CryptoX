import localFont from "next/font/local";
import "./globals.css";
import SessionWrapper from "@/components/SessionWrapper";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import { Toaster } from "@/components/ui/toaster";
import { MarketDataProvider } from "@/context/MarketDataContext";

const geistSans = localFont({
  src: "../public/fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../public/fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "CryptoX",
  description: "The Future of Finance",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <SessionWrapper>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <MarketDataProvider>
            <SidebarProvider>
              <AppSidebar />
              <main className="overflow-hidden p-10">{children}</main>
            </SidebarProvider>
          </MarketDataProvider>
          <Toaster />
        </body>
      </SessionWrapper>
    </html>
  );
}
