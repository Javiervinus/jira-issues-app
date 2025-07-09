import { ThemeProvider } from "@/ui/common/providers/ThemeProvider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5200"
  ),
  title: {
    default: "JIRA Sprint Dashboard - Betterplan",
    template: "%s | Betterplan Dashboard",
  },
  description:
    "Dashboard en tiempo real para el seguimiento de sprints JIRA del equipo Betterplan. Métricas, estado del sprint y performance del equipo.",
  keywords: [
    "JIRA",
    "Sprint",
    "Dashboard",
    "Scrum",
    "Agile",
    "Betterplan",
    "Development Team",
    "Real-time",
    "Metrics",
  ],
  authors: [{ name: "javiervinus", url: "https://github.com/javiervinus" }],
  creator: "javiervinus",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "es_ES",
    siteName: "Betterplan JIRA Dashboard",
    title: "JIRA Sprint Dashboard - Betterplan",
    description:
      "Dashboard en tiempo real para el seguimiento de sprints JIRA del equipo Betterplan.",
  },
  twitter: {
    card: "summary_large_image",
    site: "@javiervinus",
    creator: "@javiervinus",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#667eea" />
        <meta name="msapplication-TileColor" content="#667eea" />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
