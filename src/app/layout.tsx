import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  title: "Media Show Grup - Event expo-forum",
  description: "Media Show Grup - Event expo-forum",
  icons: {
    icon: "/fav.png",
    shortcut: "/fav.png",
    apple: "/fav.png",
  },
  openGraph: {
    title: "Media Show Grup - Event expo-forum",
    description: "Media Show Grup - Event expo-forum",
    url: "/",
    siteName: "Media Show Grup",
    images: [
      {
        url: "/og.jpg",
        alt: "Media Show Grup",
        width: 1200,
        height: 443,
        type: "image/jpeg",
      },
    ],
    locale: "ro_RO",
    type: "website",
  },
  alternates: {
    canonical: "/",
    languages: {
      "ro-RO": "/",
      "ru-RU": "/ru",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
