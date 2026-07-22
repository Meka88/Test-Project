import { useCallback, useEffect, useState } from 'react'
import * as api from '../services/api'
import type { Task, TaskDraft, TaskStatus } from '../types'

interface UseTasksResult {
  tasks: Task[]
  isLoading: boolean
  error: string | null
  isMutating: boolean
  mutationError: string | null
  refresh: () => Promise<void>
  addTask: (draft: TaskDraft) => Promise<Task>
  setStatus: (id: string, status: TaskStatus) => Promise<void>
  removeTask: (id: string) => Promise<void>
}

export function useTasks(): UseTasksResult {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isMutating, setIsMutating] = useState(false)
  const [mutationError, setMutationError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const fetched = await api.fetchTasks()
      setTasks(fetched)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tasks.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const addTask = useCallback(async (draft: TaskDraft) => {
    setIsMutating(true)
    setMutationError(null)
    try {
      const created = await api.createTask(draft)
      setTasks((current) => [created, ...current])
      return created
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create task.'
      setMutationError(message)
      throw err
    } finally {
      setIsMutating(false)
    }
  }, [])

  const setStatus = useCallback(async (id: string, status: TaskStatus) => {
    setMutationError(null)
    try {
      const updated = await api.updateTask(id, { status })
      setTasks((current) => current.map((task) => (task.id === id ? updated : task)))
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update task.'
      setMutationError(message)
      throw err
    }
  }, [])

  const removeTask = useCallback(async (id: string) => {
    setMutationError(null)
    try {
      await api.deleteTask(id)
      setTasks((current) => current.filter((task) => task.id !== id))
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete task.'
      setMutationError(message)
      throw err
    }
  }, [])

  return {
    tasks,
    isLoading,
    error,
    isMutating,
    mutationError,
    refresh,
    addTask,
    setStatus,
    removeTask,
  }
}
