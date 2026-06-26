import { Sidebar } from "@/components/layout/Sidebar";
import { createClient } from "@/lib/supabase-server";
import { getRole } from "@/lib/roles";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const role = getRole(user?.email);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar userEmail={user?.email} role={role} />
      <div className="flex flex-col flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  );
}
