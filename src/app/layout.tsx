import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../styles/globals.css";
import ThemeProvider from "@/components/ThemeProvider";
import ReduxStoreProvider from "@/components/ReduxStoreProvider";
import { ImageKitProvider } from "@imagekit/next";
import ToastProvider from "@/components/ToastProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Style Scape",
  description: "Discover the latest fashion trends at Style Scape – your one-stop destination for stylish, affordable clothing for men, women, and kids. Shop now and upgrade your wardrobe with ease!",
  icons: {
    icon: '/favicon.ico',
  },
};

const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT as string;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-x-clip`}
      >
        <ImageKitProvider urlEndpoint={urlEndpoint}>
          <ReduxStoreProvider>
            <ToastProvider>
              <ThemeProvider>{children}</ThemeProvider>
            </ToastProvider>
          </ReduxStoreProvider>
        </ImageKitProvider>
      </body>
    </html>
  );
}
