const statusText = (status) => {
  console.log("statusText", status.toLowerCase())
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
        case 'verificado' || 'verificada':  
            return 'Verificada'
        case 'terminado'|| 'terminada':
            return 'Veridicada'
        default:
            return status.charAt(0).toUpperCase() + status.slice(1); // Capitaliza la primera letra
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
      case "terminado":
        return "success";

  
      default:
        return "info";
    }
  };
  
export { statusText, statusColor }