const Notificacion  = ({mensaje}) => {
    if (mensaje === null){
        return null
    }
    return (
        <div className="error">
            {mensaje}
        </div>
    )
}

export default Notificacion