import {useState, forwardRef, useImperativeHandle } from 'react'

const Togglable = forwardRef((props, refs) => {
    const [visible, setVisible] = useState(false)

    const hideWhenVisible = {display: visible ? 'none' : ''}
    const ShowWhenVisible = {display: visible ? '' : 'none'}

    const toggleVisbility = () =>{
        setVisible(!visible)
    }

    useImperativeHandle(refs, () => {
        return{
            toggleVisbility
        }
    })

    return(
        <div>
            <div style={hideWhenVisible}>
                <button onClick={toggleVisbility}>{props.buttonLabel}</button>
            </div>
            <div style={ShowWhenVisible} className='toggleableContent'>
                {props.children}
                <button onClick={toggleVisbility}>cancel</button>
            </div>
        </div>
    )
})

export default Togglable