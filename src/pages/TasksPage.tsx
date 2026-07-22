import { useMemo, useState } from 'react'
import { TaskFormModal } from '../components/tasks/TaskFormModal'
import { TaskTable } from '../components/tasks/TaskTable'
import { Button } from '../components/ui/Button'
import { Select } from '../components/ui/Select'
import { useTasks } from '../hooks/useTasks'
import type { TaskStatus } from '../types'

type StatusFilter = 'all' | TaskStatus

export function TasksPage() {
  const { tasks, isLoading, error, isMutating, mutationError, addTask, setStatus, removeTask } =
    useTasks()

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch =
        search.trim().length === 0 ||
        task.title.toLowerCase().includes(search.trim().toLowerCase()) ||
        task.assignee.toLowerCase().includes(search.trim().toLowerCase())
      const matchesStatus = statusFilter === 'all' || task.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [tasks, search, statusFilter])

  return (
    <div className="page">
      <div className="page-header page-header-row">
        <div>
          <h1>Tasks</h1>
          <p className="page-subtitle">{tasks.length} total tasks</p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)}>+ New task</Button>
      </div>

      <div className="toolbar">
        <input
          type="search"
          className="field-input search-input"
          placeholder="Search by title or assignee…"
          aria-label="Search tasks"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <Select
          label="Filter by status"
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
        >
          <option value="all">All statuses</option>
          <option value="todo">To do</option>
          <option value="in_progress">In progress</option>
          <option value="done">Done</option>
        </Select>
      </div>

      {isLoading ? (
        <p role="status">Loading tasks…</p>
      ) : error ? (
        <p className="form-error" role="alert">
          {error}
        </p>
      ) : (
        <>
          {mutationError && !isCreateOpen ? (
            <p className="form-error" role="alert">
              {mutationError}
            </p>
          ) : null}
          <TaskTable
            tasks={filteredTasks}
            onStatusChange={(id, status) => void setStatus(id, status)}
            onDelete={(id) => void removeTask(id)}
          />
        </>
      )}

      <TaskFormModal
        isOpen={isCreateOpen}
        isSubmitting={isMutating}
        submitError={mutationError}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={addTask}
      />
    </div>
  )
}
