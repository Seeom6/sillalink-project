// app/layout.tsx
import type { Metadata } from "next";
import { Poppins } from 'next/font/google';
import "./globals.css";
import Providers from "./api/QeuryProvider";
import { ToastProvider } from "@/contexts/toast-context";
import { AuthProvider } from "@/contexts/AuthContext";
import { FullPageLoader } from "./shared/loaders/fullPageLoader";

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: "SillaLink Company",
  description: "SillaLink is a cutting-edge software development company specializing in innovative solutions, web applications, and digital transformation. We deliver scalable, secure, and high-performance technology tailored to your business needs.",
  keywords: [
    "software development",
    "web applications",
    "SaaS solutions",
    "digital transformation",
    "custom software",
    "IT consulting"
  ],
  icons: {
    icon: "/Silla-Link-compnay.svg"
  },
  openGraph: {
    title: "SillaLink Company | Innovative Software Solutions",
    description: "Leading software development company creating custom digital solutions for businesses.",
    url: "https://www.sillalink.com",
    siteName: "SillaLink Company",
    images: [
      {
        url: "https://www.sillalink.com/og-image.jpg",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // أضف هذا الجزء لتحديد أي layout يعرض

  return (
    <html lang="en">
      <body>
        <Providers>
          <AuthProvider>
            <ToastProvider>
              <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "Organization",
                  "name": "SillaLink Company",
                  "url": "https://www.sillalink.com",
                  "logo": "https://www.sillalink.com/logo.png",
                  "sameAs": [
                    "https://twitter.com/sillalink",
                    "https://linkedin.com/company/sillalink"
                  ]
                })
              }}
            />
              <FullPageLoader/>
              <div suppressHydrationWarning>
                {children}
              </div>
            </ToastProvider>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}