import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="page not-found-page">
      <h1>404</h1>
      <p>We couldn't find that page.</p>
      <Link to="/">Back to dashboard</Link>
    </div>
  )
}
