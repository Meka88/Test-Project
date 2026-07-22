import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { StatCard } from "../components/StatCard";
import { PriorityBadge, StatusBadge } from "../components/Badge";

export function Dashboard() {
  const { tasks, loading } = useApp();

  if (loading) {
    return <PageSkeleton />;
  }

  const total = tasks.length;
  const done = tasks.filter((t) => t.status === "done").length;
  const inProgress = tasks.filter((t) => t.status === "in_progress").length;
  const highPriority = tasks.filter(
    (t) => t.priority === "high" && t.status !== "done"
  ).length;
  const completion = total === 0 ? 0 : Math.round((done / total) * 100);

  const recent = [...tasks]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 4);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p className="subtle">A quick pulse on your team's work.</p>
        </div>
        <Link to="/tasks" className="button primary">
          View all tasks
        </Link>
      </div>

      <section className="stat-grid">
        <StatCard label="Total tasks" value={total} accent="indigo" />
        <StatCard
          label="In progress"
          value={inProgress}
          accent="amber"
          hint="Being actively worked on"
        />
        <StatCard
          label="Completed"
          value={`${completion}%`}
          accent="green"
          hint={`${done} of ${total} done`}
        />
        <StatCard
          label="High priority open"
          value={highPriority}
          accent="slate"
          hint="Needs attention"
        />
      </section>

      <section className="card">
        <div className="card-header">
          <h2>Recently added</h2>
        </div>
        <ul className="recent-list">
          {recent.map((task) => (
            <li key={task.id} className="recent-item">
              <div>
                <span className="recent-title">{task.title}</span>
                <span className="recent-meta">
                  {task.id} · {task.assignee}
                </span>
              </div>
              <div className="recent-badges">
                <PriorityBadge priority={task.priority} />
                <StatusBadge status={task.status} />
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function PageSkeleton() {
  return (
    <div className="page" aria-busy="true">
      <div className="page-header">
        <h1>Dashboard</h1>
      </div>
      <div className="stat-grid">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="stat-card skeleton" />
        ))}
      </div>
      <div className="card skeleton tall" />
    </div>
  );
}
