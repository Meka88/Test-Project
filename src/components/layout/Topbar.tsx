import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { Button } from '../ui/Button'

export function Topbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <header className="topbar">
      <div />
      <div className="topbar-user">
        <span className="topbar-username">{user?.name}</span>
        <Button variant="ghost" onClick={handleLogout}>
          Log out
        </Button>
      </div>
    </header>
  )
}
