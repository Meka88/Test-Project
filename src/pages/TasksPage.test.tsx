import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { TasksPage } from './TasksPage'

describe('TasksPage', () => {
  it('loads and displays the seeded tasks', async () => {
    render(<TasksPage />)

    expect(screen.getByRole('status')).toHaveTextContent(/loading/i)
    expect(await screen.findByText('Set up CI pipeline')).toBeInTheDocument()
  })

  it('filters tasks by search term', async () => {
    render(<TasksPage />)
    await screen.findByText('Set up CI pipeline')

    await userEvent.type(screen.getByLabelText('Search tasks'), 'onboarding')

    expect(screen.queryByText('Set up CI pipeline')).not.toBeInTheDocument()
    expect(screen.getByText('Design onboarding flow')).toBeInTheDocument()
  })

  it('creates a new task through the modal', async () => {
    render(<TasksPage />)
    await screen.findByText('Set up CI pipeline')

    await userEvent.click(screen.getByRole('button', { name: '+ New task' }))
    await userEvent.type(screen.getByLabelText('Title'), 'Write test plan')
    await userEvent.click(screen.getByRole('button', { name: 'Create task' }))

    expect(await screen.findByText('Write test plan')).toBeInTheDocument()
  })

  it('surfaces a server error when the API rejects the request', async () => {
    render(<TasksPage />)
    await screen.findByText('Set up CI pipeline')

    await userEvent.click(screen.getByRole('button', { name: '+ New task' }))
    await userEvent.type(screen.getByLabelText('Title'), 'fail')
    await userEvent.click(screen.getByRole('button', { name: 'Create task' }))

    expect(await screen.findByRole('alert')).toHaveTextContent(/something went wrong/i)
  })
})
