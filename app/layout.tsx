import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { KeycloakProvider } from "@/app/lib/auth/KeycloakProvider";
import { RoleGuard } from "@/app/lib/auth/RoleGuard";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CRM | Sistema ERP",
  description: "Módulo CRM de Clientes y Soporte - Proyecto ERP",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#FFFFFF] text-[#353535]">
        <KeycloakProvider>
          <RoleGuard>{children}</RoleGuard>
        </KeycloakProvider>
      </body>
    </html>
  );
}
