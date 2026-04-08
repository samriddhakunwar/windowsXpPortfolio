import { DesktopProvider } from "@/desktop/DesktopProvider";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Samriddha | Windows XP Portfolio",
  description:
    "A nostalgic portfolio website themed around the Windows XP desktop experience",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <DesktopProvider>{children}</DesktopProvider>
      </body>
    </html>
  );
}
