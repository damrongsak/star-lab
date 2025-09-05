export default function Home() {
  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
        <p className="text-foreground/70">Here’s what’s happening in your workspace today.</p>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Active Projects", value: "12" },
          { label: "Open Tasks", value: "58" },
          { label: "Team Members", value: "24" },
          { label: "Uptime", value: "99.98%" },
        ].map((item) => (
          <div key={item.label} className="rounded-lg border border-black/10 bg-white/70 p-4 backdrop-blur dark:border-white/10 dark:bg-black/30">
            <p className="text-xs uppercase tracking-wide text-foreground/60">{item.label}</p>
            <p className="mt-2 text-2xl font-semibold">{item.value}</p>
          </div>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-lg border border-black/10 bg-white/70 p-4 backdrop-blur dark:border-white/10 dark:bg-black/30 lg:col-span-2">
          <h2 className="text-sm font-medium">Recent Activity</h2>
          <ul className="mt-3 space-y-2 text-sm text-foreground/80">
            <li>• Deployed backend v1.2.4 to production</li>
            <li>• Added OAuth support to the API</li>
            <li>• Fixed flaky Jest tests in database-service</li>
          </ul>
        </div>
        <div className="rounded-lg border border-black/10 bg-white/70 p-4 backdrop-blur dark:border-white/10 dark:bg-black/30">
          <h2 className="text-sm font-medium">Shortcuts</h2>
          <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
            {[
              "New Project",
              "Invite Team",
              "View Logs",
              "Docs",
            ].map((s) => (
              <button key={s} className="rounded-md border border-black/10 px-3 py-2 text-left hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/10">
                {s}
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
