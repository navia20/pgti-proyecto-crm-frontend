import Topbar from "@/app/components/layout/Topbar";

export default function PagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[#FFFFFF]">
      <Topbar />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}