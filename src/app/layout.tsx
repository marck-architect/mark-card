import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import { profile } from "@/config/profile.config";
import { ToastProvider } from "@/components/ui/Toast";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const description = `${profile.title} at ${profile.company}. ${profile.bio}`;

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? profile.website),
  title: `${profile.name} | ${profile.company}`,
  description,
  openGraph: {
    title: `${profile.name} | ${profile.company}`,
    description,
    type: "profile",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${poppins.variable} h-full`}>
      <body className="min-h-dvh">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
