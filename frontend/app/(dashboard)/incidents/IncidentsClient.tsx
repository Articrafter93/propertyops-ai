"use client";

import { Fragment, useState } from "react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { SlaIndicator } from "@/components/ui/SlaIndicator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronDown, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDict } from "@/lib/i18n/client";
import type { Incident } from "@/lib/types";

export interface IncidentRow {
  incident: Incident;
  description: string;
  roomLabel: string;
  roomTypeLabel: string;
  techName: string | null;
  techSpecialty: string | null;
  tenantName: string | null;
  createdRelative: string;
  updatedRelative: string;
}

const PRIORITIES: Incident["priority"][] = ["Emergencia", "Alta", "Media", "Baja"];

export function IncidentsClient({ rows }: { rows: IncidentRow[] }) {
  const dict = useDict();
  const t = dict.incidents;
  const [priorityFilter, setPriorityFilter] = useState<Incident["priority"] | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = priorityFilter ? rows.filter((r) => r.incident.priority === priorityFilter) : rows;

  if (rows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
          <AlertTriangle className="w-6 h-6 text-muted-foreground" />
        </div>
        <p className="text-sm font-medium text-foreground mb-1">{t.emptyTitle}</p>
        <p className="text-xs text-muted-foreground">{t.emptyBody}</p>
      </div>
    );
  }

  return (
    <>
      {/* Priority filter chips */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className="text-xs text-muted-foreground mr-1">{t.filterByPriority}:</span>
        <button
          type="button"
          onClick={() => setPriorityFilter(null)}
          className={cn(
            "px-2.5 py-1 rounded-full border text-xs font-medium transition-colors",
            priorityFilter === null
              ? "bg-foreground text-background border-foreground"
              : "bg-background text-muted-foreground border-border hover:bg-muted/50"
          )}
        >
          {dict.common.all}
        </button>
        {PRIORITIES.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setPriorityFilter(p)}
            className={cn(
              "px-2.5 py-1 rounded-full border text-xs font-medium transition-colors",
              priorityFilter === p
                ? "bg-foreground text-background border-foreground"
                : "bg-background text-muted-foreground border-border hover:bg-muted/50"
            )}
          >
            {dict.statuses[p]}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-lg border border-border">
          <p className="text-sm text-muted-foreground">{t.noResultsForFilter}</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-border shadow-none overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead className="text-xs w-8">{t.colSla}</TableHead>
                <TableHead className="text-xs font-semibold">{t.colId}</TableHead>
                <TableHead className="text-xs font-semibold">{t.colDescription}</TableHead>
                <TableHead className="text-xs font-semibold">{t.colRoom}</TableHead>
                <TableHead className="text-xs font-semibold">{t.colPriority}</TableHead>
                <TableHead className="text-xs font-semibold">{t.colStatus}</TableHead>
                <TableHead className="text-xs font-semibold">{t.colTechnician}</TableHead>
                <TableHead className="text-xs font-semibold">{t.colCreated}</TableHead>
                <TableHead className="text-xs w-6" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((row) => {
                const isExpanded = expandedId === row.incident.id;
                return (
                  <Fragment key={row.incident.id}>
                    <TableRow
                      onClick={() => setExpandedId(isExpanded ? null : row.incident.id)}
                      aria-expanded={isExpanded}
                      className="hover:bg-muted/20 cursor-pointer"
                    >
                      <TableCell>
                        <SlaIndicator incident={row.incident} showLabel={false} />
                      </TableCell>
                      <TableCell className="text-xs font-mono text-muted-foreground">{row.incident.id}</TableCell>
                      <TableCell className="max-w-xs">
                        <p className="text-sm text-foreground line-clamp-2">{row.description}</p>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm font-medium">{row.roomLabel}</p>
                          <p className="text-xs text-muted-foreground">{row.roomTypeLabel}</p>
                        </div>
                      </TableCell>
                      <TableCell><StatusBadge status={row.incident.priority} /></TableCell>
                      <TableCell><StatusBadge status={row.incident.status} /></TableCell>
                      <TableCell>
                        {row.techName ? (
                          <div>
                            <p className="text-xs font-medium text-foreground">{row.techName}</p>
                            <p className="text-xs text-muted-foreground">{row.techSpecialty}</p>
                          </div>
                        ) : <span className="text-xs text-muted-foreground">—</span>}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <SlaIndicator incident={row.incident} showLabel />
                          <span className="text-xs text-muted-foreground hidden xl:inline">{row.createdRelative}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <ChevronDown className={cn("w-3.5 h-3.5 text-muted-foreground transition-transform", isExpanded && "rotate-180")} />
                      </TableCell>
                    </TableRow>
                    {isExpanded && (
                      <TableRow className="bg-muted/10 hover:bg-muted/10">
                        <TableCell colSpan={9} className="whitespace-normal py-3">
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                            <div className="sm:col-span-3">
                              <p className="font-semibold text-foreground mb-1">{t.colDescription}</p>
                              <p className="text-muted-foreground">{row.description}</p>
                            </div>
                            <div>
                              <p className="font-semibold text-foreground">{t.detailSlaTarget}</p>
                              <p className="text-muted-foreground">{t.detailHours.replace("{n}", String(row.incident.sla_hours))}</p>
                            </div>
                            <div>
                              <p className="font-semibold text-foreground">{t.detailUpdated}</p>
                              <p className="text-muted-foreground">{row.updatedRelative}</p>
                            </div>
                            {row.tenantName && (
                              <div>
                                <p className="font-semibold text-foreground">{t.detailTenant}</p>
                                <p className="text-muted-foreground">{row.tenantName}</p>
                              </div>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </Fragment>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </>
  );
}
