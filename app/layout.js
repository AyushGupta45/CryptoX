import localFont from "next/font/local";
import "./globals.css";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/navigation/AppSidebar";
import { Toaster } from "@/components/ui/toaster";

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
      <link rel="icon" href="logo.png" sizes="any" />
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SidebarProvider>
          <AppSidebar />
          <main className="overflow-hidden p-10 w-full">{children}</main>
        </SidebarProvider>
        <Toaster />
      </body>
    </html>
  );
}
