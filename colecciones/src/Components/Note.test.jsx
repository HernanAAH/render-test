import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Note from './Note'

test('render contert', ()=>{
    const note = {
        content : "test para validar el contenido de una nota",
        important: true
    }

    render(<Note note={note}/>)

    const { container } = render(<Note note={note} />)

    const div = container.querySelector('.note')
    expect(div).toHaveTextContent(
        'Component testing is done with react-testing-library'
    )
    //const element = screen.getByText("test para validar el contenido de una nota")
    //expect(element).toBeDefined()
})

test('hacer un click en el boton una vez', async ()=> {
    const note = {
        content: 'Component testing is done with react-testing-library',
        important: true
    }

    const mockhandler = vi.fn()

    render(
        <Note note={note} toggleImportance={mockhandler}/>
    )

    const user = userEvent.setup()
    const button= screen.getByText('hacer no importante')
    await user.click(button)

    expect(mockhandler.mock.calls).toHaveLength(1)
})