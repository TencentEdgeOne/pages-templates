import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.deepseek.com/"),
  title: "Deepseek Coder – AI Code Generator | EdgeOne Makers",
  description: "Generate your next app with Deepseek · Demo only · EdgeOne Makers",
  keywords: "EdgeOne Makers, Demo only",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.svg", type: "image/svg+xml", sizes: "32x32" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      {children}
    </html>
  );
}
