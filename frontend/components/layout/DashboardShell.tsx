import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";

interface DashboardShellProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export function DashboardShell({ children, title, subtitle }: DashboardShellProps) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar title={title} subtitle={subtitle} />
        <main className="flex-1 overflow-y-auto p-6 bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}
