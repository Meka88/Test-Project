import { initialTasks } from '../data/mockTasks'
import { ApiError, type Task, type TaskDraft, type User } from '../types'

/**
 * A tiny in-memory "backend" that stands in for a real API.
 *
 * It intentionally behaves like a real network call: it's async, has
 * latency, and can fail. This keeps the app's loading/error states honest,
 * which is useful when recording or replaying sessions with a tool like
 * Meticulous (network requests are part of what gets captured).
 */

const DEMO_USER: User = {
  id: 'user-1',
  name: 'Avery Chen',
  email: 'avery@taskflow.dev',
  role: 'admin',
}

const DEMO_PASSWORD = 'password123'

let tasks: Task[] = initialTasks.map((task) => ({ ...task }))

function delay(ms = 400): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function generateId(): string {
  return `task-${Math.random().toString(36).slice(2, 10)}`
}

export async function login(email: string, password: string): Promise<User> {
  await delay(500)

  if (email.trim().toLowerCase() !== DEMO_USER.email) {
    throw new ApiError('No account found with that email.', 404)
  }
  if (password !== DEMO_PASSWORD) {
    throw new ApiError('Incorrect password. Please try again.', 401)
  }

  return { ...DEMO_USER }
}

export async function fetchTasks(): Promise<Task[]> {
  await delay(350)
  return tasks.map((task) => ({ ...task }))
}

export async function createTask(draft: TaskDraft): Promise<Task> {
  await delay(450)

  if (!draft.title.trim()) {
    throw new ApiError('Title is required.', 400)
  }
  // Lets QA/testers deliberately trigger a server-error state.
  if (draft.title.trim().toLowerCase() === 'fail') {
    throw new ApiError('Something went wrong creating the task. Please retry.', 500)
  }

  const task: Task = {
    id: generateId(),
    title: draft.title.trim(),
    description: draft.description.trim(),
    status: 'todo',
    priority: draft.priority,
    assignee: draft.assignee.trim() || 'Unassigned',
    dueDate: draft.dueDate,
    createdAt: new Date().toISOString(),
  }

  tasks = [task, ...tasks]
  return { ...task }
}

export async function updateTask(id: string, updates: Partial<Task>): Promise<Task> {
  await delay(300)

  const existing = tasks.find((task) => task.id === id)
  if (!existing) {
    throw new ApiError(`Task ${id} was not found.`, 404)
  }

  const updated: Task = { ...existing, ...updates, id: existing.id }
  tasks = tasks.map((task) => (task.id === id ? updated : task))
  return { ...updated }
}

export async function deleteTask(id: string): Promise<void> {
  await delay(300)
  tasks = tasks.filter((task) => task.id !== id)
}
