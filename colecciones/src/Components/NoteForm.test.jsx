import {render, screen} from '@testing-library/react'
import NoteForm from './NoteForm' 
import userEvent from '@testing-library/user-event'

test('<NoteForm/> updates parent state and calls onSubmit', async () => {
    const createNote = vi.fn()
    const user = userEvent.setup()

    render(<NoteForm createNote={createNote}></NoteForm>)

    const input = screen.getByPlaceholderText('escribe el contenido de la nota')
    const sendButton = screen.getByText('guardar')

    await user.type(inpu, 'testing a form...')
    await user.click(sendButton)

    expect(createNote.mock.calls).toHaveLength(1)
    expect(createNote.mock.calls[0][0].content).toBe('testing a form...')
})

