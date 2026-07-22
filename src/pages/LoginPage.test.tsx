import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderWithProviders } from '../test/renderWithProviders'
import { LoginPage } from './LoginPage'

describe('LoginPage', () => {
  it('shows an error message for incorrect credentials', async () => {
    renderWithProviders(<LoginPage />)

    await userEvent.clear(screen.getByLabelText('Password'))
    await userEvent.type(screen.getByLabelText('Password'), 'wrong-password')
    await userEvent.click(screen.getByRole('button', { name: 'Sign in' }))

    expect(await screen.findByRole('alert')).toHaveTextContent(/incorrect password/i)
  })

  it('signs the user in with the demo credentials and leaves the login form', async () => {
    renderWithProviders(<LoginPage />)

    await userEvent.type(screen.getByLabelText('Password'), 'password123')
    await userEvent.click(screen.getByRole('button', { name: 'Sign in' }))

    await waitFor(() => expect(screen.queryByText('Sign in to TaskFlow')).not.toBeInTheDocument())
  })
})
