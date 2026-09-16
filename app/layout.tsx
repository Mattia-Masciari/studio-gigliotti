import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Studio Gigliotti | Consulenza Fiscale, Tributaria e Societaria",
  description: "Studio commerciale d'eccellenza specializzato in finanza agevolata, advisory societaria e controllo di gestione per imprese e professionisti.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body className="antialiased font-sans">
        <main className="overflow-x-hidden w-full max-w-full text-white bg-black min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}

