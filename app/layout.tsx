import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Deviro",
  description: "Digitaliser ditt selskap",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="../public/faviconWhiteBG.png" />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
