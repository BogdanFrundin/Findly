import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AppProvider } from "@/components/AppState";
import { SvgDefs } from "@/components/Art";
import { TabBar } from "@/components/Chrome";
import { Modals } from "@/components/Modals";

export const metadata: Metadata = {
  title: { default: "FINDLY", template: "%s · FINDLY" },
  description: "AI-пошук одягу в магазинах України. Опиши, що хочеш. Ми знайдемо.",
  appleWebApp: { capable: true, title: "FINDLY", statusBarStyle: "default" },
  icons: { icon: "/icon.svg", apple: "/icon.svg" },
};

export const viewport: Viewport = {
  width: "device-width", initialScale: 1, viewportFit: "cover", themeColor: "#F6F0E8",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&display=swap" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,200..400,0..1,0&display=block" />
      </head>
      <body>
        <SvgDefs />
        <AppProvider>
          {children}
          <TabBar />
          <Modals />
        </AppProvider>
      </body>
    </html>
  );
}
