import { useState, type FormEvent } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'

interface LocationState {
  from?: { pathname: string }
}

export function LoginPage() {
  const { user, login, isAuthenticating, error } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState('avery@taskflow.dev')
  const [password, setPassword] = useState('')

  if (user) {
    const state = location.state as LocationState | null
    return <Navigate to={state?.from?.pathname ?? '/'} replace />
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    try {
      await login(email, password)
      navigate('/', { replace: true })
    } catch {
      // `error` from useAuth() already reflects the failure.
    }
  }

  return (
    <div className="auth-page">
      <Card className="auth-card">
        <div className="auth-header">
          <span className="sidebar-logo" aria-hidden="true">
            ✓
          </span>
          <h1>Sign in to TaskFlow</h1>
          <p className="auth-subtitle">
            Demo credentials: <code>avery@taskflow.dev</code> / <code>password123</code>
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <Input
            label="Email"
            type="email"
            name="email"
            autoComplete="username"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
          <Input
            label="Password"
            type="password"
            name="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />

          {error ? (
            <p className="form-error" role="alert">
              {error}
            </p>
          ) : null}

          <Button type="submit" isLoading={isAuthenticating} className="auth-submit">
            Sign in
          </Button>
        </form>
      </Card>
    </div>
  )
}
