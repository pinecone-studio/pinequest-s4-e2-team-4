import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MonTrip",
  description: "AI аялал төлөвлөгч",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="mn" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
