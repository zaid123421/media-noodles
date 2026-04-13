import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const aktivGrotesk = localFont({
  src: [
    { path: '../public/fonts/AktivGrotesk-Thin.woff2', weight: '100', style: 'normal' },
    { path: '../public/fonts/AktivGrotesk-ThinItalic.woff2', weight: '100', style: 'italic' },
    { path: '../public/fonts/AktivGrotesk-Hairline.woff2', weight: '200', style: 'normal' },
    { path: '../public/fonts/AktivGrotesk-HairlineItalic.woff2', weight: '200', style: 'italic' },
    { path: '../public/fonts/AktivGrotesk-Light.woff2', weight: '300', style: 'normal' },
    { path: '../public/fonts/AktivGrotesk-LightItalic.woff2', weight: '300', style: 'italic' },
    { path: '../public/fonts/AktivGrotesk-Regular.woff2', weight: '400', style: 'normal' },
    { path: '../public/fonts/AktivGrotesk-Italic.woff2', weight: '400', style: 'italic' },
    { path: '../public/fonts/AktivGrotesk-Medium.woff2', weight: '500', style: 'normal' },
    { path: '../public/fonts/AktivGrotesk-MediumItalic.woff2', weight: '500', style: 'italic' },
    { path: '../public/fonts/AktivGrotesk-Bold.woff2', weight: '700', style: 'normal' },
    { path: '../public/fonts/AktivGrotesk-BoldItalic.woff2', weight: '700', style: 'italic' },
    { path: '../public/fonts/AktivGrotesk-XBold.woff2', weight: '800', style: 'normal' },
    { path: '../public/fonts/AktivGrotesk-XBoldItalic.woff2', weight: '800', style: 'italic' },
    { path: '../public/fonts/AktivGrotesk-Black.woff2', weight: '900', style: 'normal' },
    { path: '../public/fonts/AktivGrotesk-BlackItalic.woff2', weight: '900', style: 'italic' },
  ],
  variable: "--font-aktiv",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Media Noodles",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${aktivGrotesk.variable} h-full antialiased font-sans`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}