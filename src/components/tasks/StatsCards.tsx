import type { Task } from '../../types'
import { Card } from '../ui/Card'

function isOverdue(task: Task): boolean {
  return task.status !== 'done' && new Date(task.dueDate) < new Date()
}

export function StatsCards({ tasks }: { tasks: Task[] }) {
  const total = tasks.length
  const done = tasks.filter((task) => task.status === 'done').length
  const inProgress = tasks.filter((task) => task.status === 'in_progress').length
  const overdue = tasks.filter(isOverdue).length

  const stats = [
    { label: 'Total tasks', value: total },
    { label: 'In progress', value: inProgress },
    { label: 'Completed', value: done },
    { label: 'Overdue', value: overdue, tone: overdue > 0 ? 'warning' : undefined },
  ]

  return (
    <div className="stats-grid">
      {stats.map((stat) => (
        <Card key={stat.label} className={`stat-card ${stat.tone ? `stat-card-${stat.tone}` : ''}`}>
          <p className="stat-value">{stat.value}</p>
          <p className="stat-label">{stat.label}</p>
        </Card>
      ))}
    </div>
  )
}
