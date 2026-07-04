import { Suspense } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { KpiCard } from "@/components/ui/KpiCard";
import { OccupancyTrendChart } from "@/components/charts/OccupancyTrendChart";
import { RevenueByPropertyChart } from "@/components/charts/RevenueByPropertyChart";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  BarChart3, Users, AlertTriangle, CheckSquare,
  FileCheck, UserCheck, Camera, LogOut, Banknote, UserPlus,
} from "lucide-react";
import {
  getKpiHistory, getIncidents, getTenants, getPayments,
  getActivityFeed,
} from "@/lib/data";
import { revenue_by_property } from "@/lib/seed";
import { getDictionary, getLocale } from "@/lib/i18n/server";
import { fmtCurrency, fmtRelativeTime } from "@/lib/i18n/format";
import { enActivityMessage } from "@/lib/i18n/seed-en";

const iconMap: Record<string, React.ElementType> = {
  FileCheck, UserCheck, Camera, AlertTriangle, Banknote, CheckCircle: CheckSquare, LogOut, UserPlus,
};

function ChartSkeleton() {
  return <div className="h-[200px] bg-muted animate-pulse rounded-lg" />;
}

export default async function DashboardPage() {
  const [kpi_history, incidents, tenants, payments, activity_feed, dict, locale] = await Promise.all([
    getKpiHistory(),
    getIncidents(),
    getTenants(),
    getPayments(),
    getActivityFeed(),
    getDictionary(),
    getLocale(),
  ]);
  const d = dict.dashboard;

  const latest = kpi_history[kpi_history.length - 1];
  const prev = kpi_history[kpi_history.length - 8];
  const openIncidents = incidents.filter((i) => i.status === "Abierta" || i.status === "En Proceso").length;
  const pendingPayments = payments.filter((p) => p.status === "Pendiente" || p.status === "Vencido").length;
  const activeTenantsCount = tenants.filter((t) => t.status === "Active").length;
  const revenueMonthly = latest.revenue;
  const prevRevenue = prev?.revenue ?? revenueMonthly;
  const revenueDelta = Math.round(((revenueMonthly - prevRevenue) / prevRevenue) * 100);

  return (
    <>
      <TopBar title={d.title} subtitle={d.subtitle} />
      <main className="flex-1 overflow-y-auto p-6 bg-background">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
          <KpiCard
            label={d.kpiOccupancy}
            value={`${latest.occupancy_rate}%`}
            icon={BarChart3}
            delta={latest.occupancy_rate - (prev?.occupancy_rate ?? latest.occupancy_rate)}
            trend={latest.occupancy_rate > (prev?.occupancy_rate ?? 0) ? "up" : "neutral"}
            sub={d.kpiOccupancySub}
            deltaSuffix={dict.common.vsPrevMonth}
          />
          <KpiCard
            label={d.kpiRevenue}
            value={fmtCurrency(revenueMonthly, locale)}
            icon={Banknote}
            delta={revenueDelta}
            trend={revenueDelta > 0 ? "up" : revenueDelta < 0 ? "down" : "neutral"}
            iconColor="#0d9488"
            deltaSuffix={dict.common.vsPrevMonth}
          />
          <KpiCard
            label={d.kpiOpenIncidents}
            value={String(openIncidents)}
            icon={AlertTriangle}
            iconColor="#f59e0b"
            sub={(pendingPayments !== 1 ? d.paymentsPendingPlural : d.paymentsPending).replace("{count}", String(pendingPayments))}
          />
          <KpiCard
            label={d.kpiActiveTenants}
            value={String(activeTenantsCount)}
            icon={Users}
            iconColor="#6366f1"
            sub={d.kpiActiveTenantsSub}
          />
        </div>

        {/* Charts + Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Occupancy Chart */}
          <Card className="p-5 shadow-none border border-border col-span-1">
            <h3 className="text-sm font-semibold text-foreground mb-1">{d.occupancyTrend}</h3>
            <p className="text-xs text-muted-foreground mb-4">{d.occupancyTrendSub}</p>
            <Suspense fallback={<ChartSkeleton />}>
              <OccupancyTrendChart data={kpi_history} />
            </Suspense>
          </Card>

          {/* Revenue Chart */}
          <Card className="p-5 shadow-none border border-border col-span-1">
            <h3 className="text-sm font-semibold text-foreground mb-1">{d.revenueByProperty}</h3>
            <p className="text-xs text-muted-foreground mb-4">{d.revenueByPropertySub}</p>
            <Suspense fallback={<ChartSkeleton />}>
              <RevenueByPropertyChart data={revenue_by_property} />
            </Suspense>
          </Card>

          {/* Activity Feed */}
          <Card className="p-5 shadow-none border border-border col-span-1">
            <h3 className="text-sm font-semibold text-foreground mb-1">{d.recentActivity}</h3>
            <p className="text-xs text-muted-foreground mb-4">{d.recentActivitySub}</p>
            <div className="space-y-3">
              {activity_feed.map((item, i) => {
                const Icon = iconMap[item.icon] ?? CheckSquare;
                return (
                  <div key={item.id}>
                    <div className="flex items-start gap-2.5">
                      <div className="mt-0.5 p-1.5 rounded-md bg-muted shrink-0">
                        <Icon className="w-3 h-3 text-muted-foreground" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-foreground leading-snug">{enActivityMessage(item, locale)}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{fmtRelativeTime(item.timestamp, locale)}</p>
                      </div>
                    </div>
                    {i < activity_feed.length - 1 && <Separator className="mt-3" />}
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </main>
    </>
  );
}
