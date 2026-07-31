import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { PwaProvider } from "@/components/providers/pwa-provider";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "IOL Wire — News that moves",
  description:
    "The future of news. Swipe through stories that matter, built on trusted IOL journalism.",
  applicationName: "IOL Wire",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "IOL Wire",
  },
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  // Kept in sync with the live surface colour by ThemeProvider, so the phone's
  // status bar and URL bar match the app instead of framing it in black.
  themeColor: "#121016",
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`dark ${poppins.variable}`} suppressHydrationWarning>
      <head>
        {/* Keep animation frames flowing when the tab is hidden/throttled
            (background PWA, low-power webviews). Native rAF when visible. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var n=window.requestAnimationFrame.bind(window),c=window.cancelAnimationFrame.bind(window),i=0,p={};window.requestAnimationFrame=function(cb){if(!document.hidden)return n(cb);var k=--i;p[k]=setTimeout(function(){delete p[k];cb(performance.now())},35);return k};window.cancelAnimationFrame=function(h){if(h<0){clearTimeout(p[h]);delete p[h]}else c(h)};if(document.hidden){try{delete Element.prototype.animate}catch(e){}}})();`,
          }}
        />
      </head>
      <body className="min-h-dvh overflow-x-hidden">
        <ThemeProvider>{children}</ThemeProvider>
        <PwaProvider />
      </body>
    </html>
  );
}
