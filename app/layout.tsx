import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import strings from "@/common/strings";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: strings.siteTitle,
  description: strings.description,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
