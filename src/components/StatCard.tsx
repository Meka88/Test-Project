interface StatCardProps {
  label: string;
  value: number | string;
  hint?: string;
  accent?: "indigo" | "amber" | "green" | "slate";
}

export function StatCard({ label, value, hint, accent = "slate" }: StatCardProps) {
  return (
    <div className={`stat-card accent-${accent}`}>
      <span className="stat-label">{label}</span>
      <span className="stat-value">{value}</span>
      {hint && <span className="stat-hint">{hint}</span>}
    </div>
  );
}
