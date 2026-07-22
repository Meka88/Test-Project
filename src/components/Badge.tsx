import type { TaskPriority, TaskStatus } from "../types";
import { PRIORITY_LABELS, STATUS_LABELS } from "../types";

export function StatusBadge({ status }: { status: TaskStatus }) {
  return <span className={`badge status-${status}`}>{STATUS_LABELS[status]}</span>;
}

export function PriorityBadge({ priority }: { priority: TaskPriority }) {
  return (
    <span className={`badge priority-${priority}`}>{PRIORITY_LABELS[priority]}</span>
  );
}
