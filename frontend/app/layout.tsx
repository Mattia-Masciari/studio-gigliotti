import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GIO | Premium Accounting Firm",
  description: "Awwwards-level accounting and corporate advisory firm.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased font-sans">
        <main className="overflow-x-hidden w-full max-w-full text-white bg-black min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
