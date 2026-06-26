export default function DashboardLoading() {
  return (
    <div className="flex flex-col flex-1 overflow-hidden animate-pulse">
      {/* TopBar skeleton */}
      <div className="h-14 shrink-0 bg-card border-b border-border flex items-center px-6 gap-3">
        <div className="h-4 w-40 bg-muted rounded" />
        <div className="h-3 w-28 bg-muted rounded opacity-60" />
      </div>
      {/* Content skeleton */}
      <main className="flex-1 overflow-y-auto p-6 bg-background space-y-4">
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 bg-muted rounded-lg" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-56 bg-muted rounded-lg" />
          ))}
        </div>
        <div className="h-64 bg-muted rounded-lg" />
      </main>
    </div>
  );
}
