import { Link } from 'react-router-dom'
import { StatsCards } from '../components/tasks/StatsCards'
import { StatusBadge, PriorityBadge } from '../components/ui/Badge'
import { Card } from '../components/ui/Card'
import { EmptyState } from '../components/ui/EmptyState'
import { useAuth } from '../hooks/useAuth'
import { useTasks } from '../hooks/useTasks'

export function DashboardPage() {
  const { user } = useAuth()
  const { tasks, isLoading, error } = useTasks()

  const recentTasks = [...tasks]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)

  return (
    <div className="page">
      <div className="page-header">
        <h1>Welcome back, {user?.name.split(' ')[0]}</h1>
        <p className="page-subtitle">Here's what's happening across your team's tasks.</p>
      </div>

      {isLoading ? (
        <p role="status">Loading dashboard…</p>
      ) : error ? (
        <p className="form-error" role="alert">
          {error}
        </p>
      ) : (
        <>
          <StatsCards tasks={tasks} />

          <Card className="recent-tasks">
            <div className="card-header">
              <h2>Recent tasks</h2>
              <Link to="/tasks">View all</Link>
            </div>
            {recentTasks.length === 0 ? (
              <EmptyState
                title="No tasks yet"
                description="Create your first task to get started."
              />
            ) : (
              <ul className="recent-task-list">
                {recentTasks.map((task) => (
                  <li key={task.id}>
                    <div>
                      <p className="task-title">{task.title}</p>
                      <p className="task-description">Assigned to {task.assignee}</p>
                    </div>
                    <div className="recent-task-badges">
                      <PriorityBadge priority={task.priority} />
                      <StatusBadge status={task.status} />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </>
      )}
    </div>
  )
}
