import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LovethDev | Full-Stack Developer",
  description:
    "LovethDev is a full-stack developer portfolio showcasing modern web development, responsive interfaces and digital projects.",
  keywords: [
    "LovethDev",
    "full-stack developer",
    "web developer",
    "Next.js",
    "React",
    "portfolio",
  ],
  authors: [{ name: "LovethDev" }],
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "LovethDev | Full-Stack Developer",
    description:
      "LovethDev is a full-stack developer portfolio showcasing modern web development, responsive interfaces and digital projects.",
    type: "website",
    locale: "en_US",
    siteName: "LovethDev",
  },
  twitter: {
    card: "summary_large_image",
    title: "LovethDev | Full-Stack Developer",
    description:
      "LovethDev is a full-stack developer portfolio showcasing modern web development, responsive interfaces and digital projects.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
