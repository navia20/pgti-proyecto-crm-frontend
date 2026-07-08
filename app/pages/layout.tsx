"use client";

import Topbar from "@/app/components/layout/Topbar";
import Providers from "./providers";
import PageTransition from "@/app/components/layout/PageTransition";
import DynamicTitle from "@/app/components/layout/DynamicTitle";

export default function PagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <DynamicTitle />
      <div className="min-h-screen flex flex-col bg-[#FFFFFF]">
        <Topbar />
        <main className="flex-1 overflow-hidden">
          <PageTransition>{children}</PageTransition>
        </main>
      </div>
    </Providers>
  );
}
