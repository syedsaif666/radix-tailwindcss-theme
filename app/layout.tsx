import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import Footer from "@/components/footer";
import Provider from "@/components/provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dynamic Theme Generator | Radix & Tailwind",
  description: "Customize and generate CSS themes with ease.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className}`} id="themeDisplayArea">
        <Provider>
          <main className="bg-bg-base">{children}</main>
          <Footer />
        </Provider>
      </body>
    </html>
  );
}
