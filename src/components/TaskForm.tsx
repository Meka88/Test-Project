import { useState, type FormEvent } from "react";
import type { NewTaskInput } from "../context/AppContext";
import { TEAM_MEMBERS } from "../data/seed";
import type { TaskPriority, TaskStatus } from "../types";
import { PRIORITY_LABELS, STATUS_LABELS } from "../types";

interface TaskFormProps {
  onSubmit: (input: NewTaskInput) => void;
  onCancel: () => void;
}

export function TaskForm({ onSubmit, onCancel }: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [status, setStatus] = useState<TaskStatus>("todo");
  const [assignee, setAssignee] = useState(TEAM_MEMBERS[0]);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (title.trim().length < 3) {
      setError("Title must be at least 3 characters.");
      return;
    }
    setError(null);
    onSubmit({ title, description, priority, status, assignee });
  }

  return (
    <form className="task-form" onSubmit={handleSubmit} noValidate>
      <label className="field">
        <span>Title</span>
        <input
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Fix flaky login test"
          autoFocus
        />
      </label>

      <label className="field">
        <span>Description</span>
        <textarea
          name="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          placeholder="Optional details…"
        />
      </label>

      <div className="field-row">
        <label className="field">
          <span>Priority</span>
          <select
            name="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as TaskPriority)}
          >
            {Object.entries(PRIORITY_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>Status</span>
          <select
            name="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as TaskStatus)}
          >
            {Object.entries(STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>Assignee</span>
          <select
            name="assignee"
            value={assignee}
            onChange={(e) => setAssignee(e.target.value)}
          >
            {TEAM_MEMBERS.map((member) => (
              <option key={member} value={member}>
                {member}
              </option>
            ))}
          </select>
        </label>
      </div>

      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}

      <div className="form-actions">
        <button type="button" className="button ghost" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="button primary">
          Create task
        </button>
      </div>
    </form>
  );
}
