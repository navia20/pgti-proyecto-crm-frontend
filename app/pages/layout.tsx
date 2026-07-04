import Topbar from "@/app/components/layout/Topbar";
import Providers from "./providers";

export default function PagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <div className="min-h-screen flex flex-col bg-[#FFFFFF]">
        <Topbar />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </Providers>
  );
}
