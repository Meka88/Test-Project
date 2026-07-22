import { createContext, useCallback, useMemo, useState, type ReactNode } from 'react'
import { login as apiLogin } from '../services/api'
import type { User } from '../types'

const STORAGE_KEY = 'taskflow.user'

export interface AuthContextValue {
  user: User | null
  isAuthenticating: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)

function readStoredUser(): User | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as User) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => readStoredUser())
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const login = useCallback(async (email: string, password: string) => {
    setIsAuthenticating(true)
    setError(null)
    try {
      const loggedInUser = await apiLogin(email, password)
      setUser(loggedInUser)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(loggedInUser))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to sign in.')
      throw err
    } finally {
      setIsAuthenticating(false)
    }
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  const value = useMemo(
    () => ({ user, isAuthenticating, error, login, logout }),
    [user, isAuthenticating, error, login, logout],
  )

  return <AuthContext value={value}>{children}</AuthContext>
}
