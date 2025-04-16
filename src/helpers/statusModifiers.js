const statusText = (status) => {
    status = status.toLowerCase()

    switch (status) {
        case 'solicitado':
            return 'Solicitada'
        case 'pendienterecoleccion':
            return 'Pendiente de recolección'
        case 'recolectada' || 'recolectado' :
            return 'Recolectada' 
        case 'cancelado':
            return 'Cancelada'
        case 'entregadacentro':
            return 'Entregada al centro'
        case 'verificado' || 'verificada' || 'verificado' || 'verificada':
            return 'Verificada'
        default:
            return 'indefinido'
    }
}

const statusColor = (rawStatus = "") => {
    const status = rawStatus
      .normalize("NFD")             // quita tildes
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "")          // sin espacios
      .toLowerCase();
  
    switch (status) {
      case "solicitada":
        return "info";
  
      case "pendienterecoleccion":
        return "warning";
  
      case "recolectada":
      case "recolectado":
        return "primary";
  
      case "entregadacentro":
        return "success";
  
      case "verificado":
      case "verificada":
        return "success";
  
      case "cancelado":
        return "error";
  
      default:
        return "info";
    }
  };
  
export { statusText, statusColor }