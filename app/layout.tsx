import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "My Fridge",
  description: "Track what's in your fridge",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>{children}</body>
    </html>
  );
}
