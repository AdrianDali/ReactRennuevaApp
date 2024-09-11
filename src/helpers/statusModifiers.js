const statusText = (status) => {
    switch (status) {
        case 'solicitado':
            return 'Solicitada'
        case 'pendienteRecoleccion':
            return 'Pendiente de recolección'
        case 'recolectada':
            return 'Recolectada'
        case 'cancelado':
            return 'Cancelada'
        case 'entregadaCentro':
            return 'Entregada al centro'
        default:
            return 'indefinido'
    }
}

const statusColor = (status) => {
    switch (status) {
        case 'solicitada':
            return 'info'
        case 'pendienteRecoleccion':
            return 'warning'
        case 'recolectada':
            return 'success'
        case 'cancelado':
            return 'error'
        case 'entregadaCentro':
            return 'success'
        default:
            return 'info'
    }
}

export { statusText, statusColor }