import type { Task, TaskStatus } from '../../types'
import { EmptyState } from '../ui/EmptyState'
import { PriorityBadge, StatusBadge } from '../ui/Badge'
import { Button } from '../ui/Button'

const STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
  { value: 'todo', label: 'To do' },
  { value: 'in_progress', label: 'In progress' },
  { value: 'done', label: 'Done' },
]

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

interface TaskTableProps {
  tasks: Task[]
  onStatusChange: (id: string, status: TaskStatus) => void
  onDelete: (id: string) => void
}

export function TaskTable({ tasks, onStatusChange, onDelete }: TaskTableProps) {
  if (tasks.length === 0) {
    return (
      <EmptyState
        title="No tasks match your filters"
        description="Try adjusting the search or filters, or create a new task."
      />
    )
  }

  return (
    <table className="task-table" data-testid="task-table">
      <thead>
        <tr>
          <th scope="col">Task</th>
          <th scope="col">Status</th>
          <th scope="col">Priority</th>
          <th scope="col">Assignee</th>
          <th scope="col">Due</th>
          <th scope="col" className="visually-hidden">
            Actions
          </th>
        </tr>
      </thead>
      <tbody>
        {tasks.map((task) => (
          <tr key={task.id} data-testid="task-row">
            <td>
              <p className="task-title">{task.title}</p>
              {task.description ? <p className="task-description">{task.description}</p> : null}
            </td>
            <td>
              <label className="visually-hidden" htmlFor={`status-${task.id}`}>
                Status for {task.title}
              </label>
              <select
                id={`status-${task.id}`}
                className="status-select"
                value={task.status}
                onChange={(event) => onStatusChange(task.id, event.target.value as TaskStatus)}
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <StatusBadge status={task.status} />
            </td>
            <td>
              <PriorityBadge priority={task.priority} />
            </td>
            <td>{task.assignee}</td>
            <td>{formatDate(task.dueDate)}</td>
            <td>
              <Button
                variant="ghost"
                aria-label={`Delete ${task.title}`}
                onClick={() => onDelete(task.id)}
              >
                Delete
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
