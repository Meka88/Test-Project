export type TaskStatus = 'todo' | 'in_progress' | 'done'

export type TaskPriority = 'low' | 'medium' | 'high'

export interface Task {
  id: string
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  assignee: string
  dueDate: string // ISO date string
  createdAt: string // ISO date string
}

export type TaskDraft = Pick<Task, 'title' | 'description' | 'priority' | 'assignee' | 'dueDate'>

export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'member'
}

export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}
