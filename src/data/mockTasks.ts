import type { Task } from '../types'

function daysFromNow(days: number): string {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return date.toISOString()
}

export const initialTasks: Task[] = [
  {
    id: 'task-1',
    title: 'Set up CI pipeline',
    description: 'Wire up lint, typecheck, test, and build steps in GitHub Actions.',
    status: 'done',
    priority: 'high',
    assignee: 'Priya Patel',
    dueDate: daysFromNow(-2),
    createdAt: daysFromNow(-10),
  },
  {
    id: 'task-2',
    title: 'Design onboarding flow',
    description: 'Sketch the first-run experience for new workspace members.',
    status: 'in_progress',
    priority: 'medium',
    assignee: 'Sam Lee',
    dueDate: daysFromNow(3),
    createdAt: daysFromNow(-6),
  },
  {
    id: 'task-3',
    title: 'Fix flaky checkout test',
    description: 'The "apply promo code" e2e test fails intermittently in CI.',
    status: 'in_progress',
    priority: 'high',
    assignee: 'Priya Patel',
    dueDate: daysFromNow(1),
    createdAt: daysFromNow(-4),
  },
  {
    id: 'task-4',
    title: 'Write release notes',
    description: 'Summarize changes for the upcoming v1.4 release.',
    status: 'todo',
    priority: 'low',
    assignee: 'Jordan Ellis',
    dueDate: daysFromNow(7),
    createdAt: daysFromNow(-1),
  },
  {
    id: 'task-5',
    title: 'Audit dashboard accessibility',
    description: 'Run an automated + manual a11y pass over the dashboard page.',
    status: 'todo',
    priority: 'medium',
    assignee: 'Sam Lee',
    dueDate: daysFromNow(-1),
    createdAt: daysFromNow(-3),
  },
  {
    id: 'task-6',
    title: 'Migrate settings form to new inputs',
    description: 'Swap legacy inputs for the shared UI kit components.',
    status: 'done',
    priority: 'low',
    assignee: 'Jordan Ellis',
    dueDate: daysFromNow(-5),
    createdAt: daysFromNow(-12),
  },
]
