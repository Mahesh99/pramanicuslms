import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "Python Training — Pramanicus Academy",
  description: "Authenticated course notes for Pramanicus Academy Python Training",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <Script
          src="https://cdn.jsdelivr.net/pyodide/v0.27.6/full/pyodide.js"
          strategy="afterInteractive"
        />
        <Script src="/js/pyodide-runner.js" strategy="lazyOnload" />
      </body>
    </html>
  );
}
