import { TopBar } from "@/components/layout/TopBar";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getAutomationRuns, getErrorLogs } from "@/lib/data";
import { Activity, AlertCircle, Clock, Zap, Info } from "lucide-react";
import { getDictionary, getLocale } from "@/lib/i18n/server";
import { fmtRelativeTime } from "@/lib/i18n/format";

function msToReadable(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

export default async function AutomatizacionesPage() {
  const [automation_runs, error_log, dict, locale] = await Promise.all([getAutomationRuns(), getErrorLogs(), getDictionary(), getLocale()]);
  const t = dict.automations;
  const totalRuns = automation_runs.reduce((s, r) => s + r.runs_7d, 0);
  const totalErrors = automation_runs.reduce((s, r) => s + r.errors_7d, 0);
  const avgSuccess = Math.round(automation_runs.reduce((s, r) => s + r.success_rate, 0) / automation_runs.length);

  return (
    <>
      <TopBar title={t.title} subtitle={t.subtitle} />
      <main className="flex-1 overflow-y-auto p-6 bg-background space-y-5">
        {/* Demo notice — honest disclosure of simulated data */}
        <div className="flex items-start gap-3 p-3.5 rounded-lg bg-blue-50 border border-blue-200">
          <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-blue-800">{t.demoTitle}</p>
            <p className="text-xs text-blue-700 mt-0.5">
              {t.demoBody1} <code className="text-[10px] font-mono">docs/ARCHITECTURE.md</code> {t.demoBody2}
            </p>
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="p-4 shadow-none border border-border flex items-center gap-3">
            <div className="p-2 rounded-lg" style={{ background: "#e8f5f5" }}>
              <Zap className="w-4 h-4" style={{ color: "#1a7070" }} />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{totalRuns}</p>
              <p className="text-xs text-muted-foreground">{t.statRuns7d}</p>
            </div>
          </Card>
          <Card className="p-4 shadow-none border border-border flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-50">
              <Activity className="w-4 h-4 text-green-700" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{avgSuccess}%</p>
              <p className="text-xs text-muted-foreground">{t.statAvgSuccess}</p>
            </div>
          </Card>
          <Card className="p-4 shadow-none border border-border flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-50">
              <AlertCircle className="w-4 h-4 text-red-700" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{totalErrors}</p>
              <p className="text-xs text-muted-foreground">{t.statErrors7d}</p>
            </div>
          </Card>
        </div>

        {/* Scenarios table */}
        <Card className="shadow-none border border-border overflow-hidden">
          <div className="px-5 py-3 border-b border-border">
            <h3 className="text-sm font-semibold text-foreground">{t.scenariosTitle}</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/40 border-b border-border">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">{t.colScenario}</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">{t.colStatus}</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">{t.colLastRun}</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">{t.colNext}</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground w-40">{t.colSuccessRate}</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">{t.colAvgTime}</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">{t.colRuns7d}</th>
                </tr>
              </thead>
              <tbody>
                {automation_runs.map((run) => (
                  <tr key={run.scenario_id} className="border-b border-border last:border-0 hover:bg-muted/20">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded">{run.scenario_id}</span>
                        <span className="font-medium text-foreground">{dict.seedContent.scenario[run.scenario] ?? run.scenario}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5"><StatusBadge status={run.status} /></td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {fmtRelativeTime(run.last_run, locale)}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-muted-foreground">
                      {run.next_run ? fmtRelativeTime(run.next_run, locale) : <span className="text-muted-foreground/50">—</span>}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <Progress value={run.success_rate} className="w-24 h-1.5" />
                        <span className={`text-xs font-semibold ${run.success_rate >= 95 ? "text-green-700" : run.success_rate >= 80 ? "text-amber-700" : "text-red-700"}`}>
                          {run.success_rate}%
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-muted-foreground">{msToReadable(run.avg_duration_ms)}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5 text-xs">
                        <span className="font-semibold text-foreground">{run.runs_7d}</span>
                        {run.errors_7d > 0 && (
                          <span className="text-red-600">({run.errors_7d} {run.errors_7d > 1 ? t.errorPlural : t.errorSingular})</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Error log */}
        <Card className="shadow-none border border-border overflow-hidden">
          <div className="px-5 py-3 border-b border-border flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <h3 className="text-sm font-semibold text-foreground">{t.errorLogTitle}</h3>
          </div>
          <div className="divide-y divide-border">
            {error_log.length === 0 && (
              <div className="px-5 py-10 text-center">
                <p className="text-xs text-muted-foreground">{t.noErrors}</p>
              </div>
            )}
            {error_log.map((err) => (
              <div key={err.id} className="px-5 py-4 hover:bg-muted/20">
                <div className="flex items-start justify-between gap-3 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-muted-foreground bg-red-50 text-red-700 px-1.5 py-0.5 rounded border border-red-200">{err.scenario_id}</span>
                    <span className="text-xs font-semibold text-foreground">{dict.seedContent.scenario[err.scenario] ?? err.scenario}</span>
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0">{fmtRelativeTime(err.timestamp, locale)}</span>
                </div>
                <p className="text-xs text-red-700 font-medium mb-1">{err.error}</p>
                <p className="text-xs text-muted-foreground">{t.moduleLabel}: <code className="font-mono bg-muted px-1 rounded">{err.module}</code></p>
                <p className="text-xs text-muted-foreground mt-0.5">{t.payloadLabel}: {err.payload_summary}</p>
              </div>
            ))}
          </div>
        </Card>
      </main>
    </>
  );
}
