export default function cancelationReassonText(cancelationReasson) {
    switch (cancelationReasson) {
        case "faltaEspacio":
            return "Falta de espacio en camioneta";
        case "noDisponible":
            return "La persona no se encuentra disponible";
        case "bajaBateria":
            return "Batería baja en camioneta";
        case "activoEspontaneo":
            return "Actividad espontánea";
        default:
            return "Consulte comentarios de cancelación";
    }
}