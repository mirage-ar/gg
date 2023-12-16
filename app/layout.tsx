// "use client";

import type { Metadata, Viewport } from "next";
import "./globals.css";
import { PrivyProvider } from "@privy-io/react-auth";
import { Suspense } from "react";
import MapboxMap from "@/components/map/MapboxMap";
import BottomNavigation from "@/components/navigation/BottomNavigation";

const APP_NAME = "GG";
const APP_DEFAULT_TITLE = "GG App";
const APP_TITLE_TEMPLATE = "%s - App";
const APP_DESCRIPTION = "May the odds be ever in your favor.";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
    // startUpImage: [],
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <>
          {/* <PrivyProvider
            appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID as string}
            config={{
              loginMethods: ["twitter", "wallet"],
              
              appearance: {
                theme: "dark",
                showWalletLoginFirst: false,
              },
            }}
          > */}
          {/* <h4>Application context (if needed)</h4> */}
          <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
          {/* </PrivyProvider> */}
        </>
      </body>
    </html>
  );
}
