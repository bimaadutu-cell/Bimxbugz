import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BimxZ BugXZ — V2 Black Red White Neon Ultimate | Real Baileys",
  description: "BimxZ BugXZ V2 Super All-in-One Platform Ultimate Edition by BimzOfficial — Black Red White Neon Digital • Real Baileys v6.7.18 • 25 Bug Brutal V2 • Kill Group Invisible • Cinema HD • Bimzai AI Arena • 120FPS",
  manifest: "/manifest.json",
  icons: {
    icon: "/logo-bimxz.png",
    apple: "/logo-bimxz.png",
    shortcut: "/logo-bimxz.png",
  },
  applicationName: "BimxZ BugXZ V2",
  appleWebApp: {
    capable: true,
    title: "BimxZ BugXZ V2",
    statusBarStyle: "black-translucent",
  },
  openGraph: {
    title: "BimxZ BugXZ V2 — Black Red White Neon Ultimate",
    description: "Platform anti-scammer terkuat dengan 25 bug brutal V2 + Kill Group Real Baileys, Cinema HD, AI Arena, Live Chat — Tema hitam-merah-putih neon digital 120FPS",
    images: ["/logo-bimxz.png"],
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#000000",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="BimxZ BugXZ V2" />
        <link rel="apple-touch-icon" href="/logo-bimxz.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <style dangerouslySetInnerHTML={{__html: `
          /* Prevent white flash */
          html { background: #000; }
          body { background: #000; margin:0; }
          /* Black red neon scrollbar */
          ::-webkit-scrollbar { width: 6px; height: 6px; }
          ::-webkit-scrollbar-track { background: #000; }
          ::-webkit-scrollbar-thumb { background: linear-gradient(#000, #ff0040); border-radius: 3px; }
          ::-webkit-scrollbar-thumb:hover { background: #ff0040; }
        `}} />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
