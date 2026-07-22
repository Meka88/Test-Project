import { useState, type FormEvent } from 'react'
import type { TaskDraft, TaskPriority } from '../../types'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Modal } from '../ui/Modal'
import { Select } from '../ui/Select'
import { Textarea } from '../ui/Textarea'

interface TaskFormModalProps {
  isOpen: boolean
  isSubmitting: boolean
  submitError: string | null
  onClose: () => void
  onSubmit: (draft: TaskDraft) => Promise<unknown>
}

const EMPTY_DRAFT: TaskDraft = {
  title: '',
  description: '',
  priority: 'medium',
  assignee: '',
  dueDate: new Date().toISOString().slice(0, 10),
}

export function TaskFormModal({
  isOpen,
  isSubmitting,
  submitError,
  onClose,
  onSubmit,
}: TaskFormModalProps) {
  const [draft, setDraft] = useState<TaskDraft>(EMPTY_DRAFT)
  const [titleError, setTitleError] = useState<string | null>(null)

  function handleClose() {
    setDraft(EMPTY_DRAFT)
    setTitleError(null)
    onClose()
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()

    if (!draft.title.trim()) {
      setTitleError('Give this task a title.')
      return
    }
    setTitleError(null)

    try {
      await onSubmit(draft)
      setDraft(EMPTY_DRAFT)
      onClose()
    } catch {
      // The caller surfaces `submitError`; keep the form open so the user can retry.
    }
  }

  return (
    <Modal title="New task" isOpen={isOpen} onClose={handleClose}>
      <form onSubmit={handleSubmit} noValidate>
        <Input
          label="Title"
          name="title"
          value={draft.title}
          error={titleError}
          onChange={(event) => setDraft({ ...draft, title: event.target.value })}
          placeholder="e.g. Review pull request #42"
          autoFocus
        />
        <Textarea
          label="Description"
          name="description"
          value={draft.description}
          onChange={(event) => setDraft({ ...draft, description: event.target.value })}
          rows={3}
          placeholder="Optional details"
        />
        <div className="field-row">
          <Select
            label="Priority"
            name="priority"
            value={draft.priority}
            onChange={(event) =>
              setDraft({ ...draft, priority: event.target.value as TaskPriority })
            }
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </Select>
          <Input
            label="Due date"
            name="dueDate"
            type="date"
            value={draft.dueDate.slice(0, 10)}
            onChange={(event) => setDraft({ ...draft, dueDate: event.target.value })}
          />
        </div>
        <Input
          label="Assignee"
          name="assignee"
          value={draft.assignee}
          onChange={(event) => setDraft({ ...draft, assignee: event.target.value })}
          placeholder="Who owns this?"
        />

        {submitError ? (
          <p className="form-error" role="alert">
            {submitError}
          </p>
        ) : null}

        <div className="modal-actions">
          <Button type="button" variant="ghost" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            Create task
          </Button>
        </div>
      </form>
    </Modal>
  )
}
