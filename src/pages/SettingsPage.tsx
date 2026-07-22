import { useState, type FormEvent } from 'react'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { useAuth } from '../hooks/useAuth'

export function SettingsPage() {
  const { user } = useAuth()
  const [name, setName] = useState(user?.name ?? '')
  const [email, setEmail] = useState(user?.email ?? '')
  const [savedAt, setSavedAt] = useState<number | null>(null)

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    // This demo app doesn't persist settings to a backend; it just
    // simulates a successful save so the UI flow can be recorded/tested.
    setSavedAt(Date.now())
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Settings</h1>
        <p className="page-subtitle">Manage your profile information.</p>
      </div>

      <Card className="settings-card">
        <form onSubmit={handleSubmit}>
          <Input label="Full name" value={name} onChange={(event) => setName(event.target.value)} />
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <div className="modal-actions">
            {savedAt ? <p className="save-confirmation">Saved!</p> : null}
            <Button type="submit">Save changes</Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
