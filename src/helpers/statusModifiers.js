const statusText = (status) => {
    status = status.toLowerCase()

    switch (status) {
        case 'solicitado':
            return 'Solicitada'
        case 'pendienterecoleccion':
            return 'Pendiente de recolección'
        case 'recolectada' || 'recolectado':
            return 'Recolectada' 
        case 'cancelado':
            return 'Cancelada'
        case 'entregadacentro':
            return 'Entregada al centro'
        default:
            return 'indefinido'
    }
}

const statusColor = (status) => {
    status = status.toLowerCase()

    switch (status) {
        case 'solicitada':
            return 'info'
        case 'pendienterecoleccion':
            return 'warning'
        case 'recolectada' || 'recolectado':
            return 'success'
        case 'cancelado':
            return 'error'
        case 'entregadacentro':
            return 'success'
        default:
            return 'info'
    }
}

export { statusText, statusColor }