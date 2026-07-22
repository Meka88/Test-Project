import { useMemo, useState } from "react";
import { useApp } from "../context/AppContext";
import { Modal } from "../components/Modal";
import { TaskForm } from "../components/TaskForm";
import { PriorityBadge, StatusBadge } from "../components/Badge";
import type { TaskStatus } from "../types";
import { STATUS_LABELS } from "../types";

type Filter = "all" | TaskStatus;

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "todo", label: STATUS_LABELS.todo },
  { value: "in_progress", label: STATUS_LABELS.in_progress },
  { value: "done", label: STATUS_LABELS.done },
];

export function Tasks() {
  const { tasks, loading, addTask, deleteTask, cycleStatus } = useApp();
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const visible = useMemo(() => {
    return tasks.filter((t) => {
      const matchesFilter = filter === "all" || t.status === filter;
      const q = query.trim().toLowerCase();
      const matchesQuery =
        q === "" ||
        t.title.toLowerCase().includes(q) ||
        t.assignee.toLowerCase().includes(q) ||
        t.id.toLowerCase().includes(q);
      return matchesFilter && matchesQuery;
    });
  }, [tasks, filter, query]);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Tasks</h1>
          <p className="subtle">
            {visible.length} of {tasks.length} tasks shown
          </p>
        </div>
        <button
          className="button primary"
          onClick={() => setModalOpen(true)}
          data-testid="new-task-button"
        >
          + New task
        </button>
      </div>

      <div className="toolbar">
        <div className="filter-group" role="tablist" aria-label="Filter by status">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              role="tab"
              aria-selected={filter === f.value}
              className={`chip${filter === f.value ? " active" : ""}`}
              onClick={() => setFilter(f.value)}
            >
              {f.label}
            </button>
          ))}
        </div>
        <input
          className="toolbar-search"
          placeholder="Filter by title, assignee, or ID…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Filter tasks"
        />
      </div>

      {loading ? (
        <div className="card skeleton tall" aria-busy="true" />
      ) : visible.length === 0 ? (
        <div className="empty-state">
          <p className="empty-title">No tasks match your filters</p>
          <p className="subtle">Try clearing the search or switching tabs.</p>
        </div>
      ) : (
        <div className="card table-card">
          <table className="task-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Assignee</th>
                <th>Priority</th>
                <th>Status</th>
                <th aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {visible.map((task) => (
                <tr key={task.id}>
                  <td className="mono">{task.id}</td>
                  <td>
                    <div className="cell-title">{task.title}</div>
                    {task.description && (
                      <div className="cell-desc">{task.description}</div>
                    )}
                  </td>
                  <td>{task.assignee}</td>
                  <td>
                    <PriorityBadge priority={task.priority} />
                  </td>
                  <td>
                    <button
                      className="status-button"
                      onClick={() => cycleStatus(task.id)}
                      title="Click to advance status"
                    >
                      <StatusBadge status={task.status} />
                    </button>
                  </td>
                  <td className="actions-cell">
                    <button
                      className="button ghost danger small"
                      onClick={() => deleteTask(task.id)}
                      aria-label={`Delete ${task.id}`}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        open={modalOpen}
        title="Create a new task"
        onClose={() => setModalOpen(false)}
      >
        <TaskForm
          onSubmit={(input) => {
            addTask(input);
            setModalOpen(false);
          }}
          onCancel={() => setModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
