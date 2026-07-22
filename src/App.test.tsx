import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import App from './App'
import { AuthProvider } from './context/AuthContext'

function renderApp(route: string) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </MemoryRouter>,
  )
}

describe('App routing', () => {
  it('redirects unauthenticated visitors to the login page', async () => {
    renderApp('/')

    expect(await screen.findByText('Sign in to TaskFlow')).toBeInTheDocument()
  })

  it('renders a 404 page for unknown routes', async () => {
    renderApp('/this-page-does-not-exist')

    expect(await screen.findByText('404')).toBeInTheDocument()
  })
})
