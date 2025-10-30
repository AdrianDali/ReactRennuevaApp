import ListTemplate, { ListTemplateItem } from "./ListSideBar/ListTemplate";
import {
  Assignment,
  AssignmentReturned as AssignmentReturnedIcon,
  DirectionsRunRounded,
  Recycling,
  Person as PersonIcon,
  History as HistoryIcon, // Importamos el icono de historial
} from "@mui/icons-material";

// Ítem: Centros de acopio
const usersItem = new ListTemplateItem({
  tag: "Centros de acopio",
  icon: <Recycling />,
  redirection: "/centrosAcopio",
});

// Ítem: Recolección con subelemento
const collectRequestItem = new ListTemplateItem({
  tag: "Recolección",
  icon: <DirectionsRunRounded />,
  subElemnets: [
    new ListTemplateItem({
      tag: "Reporte Donadores",
      icon: <AssignmentReturnedIcon />,
      redirection: "/centro/create",
    }),
  ],
});

// Ítem: Reportes asignados
const asignaciones = new ListTemplateItem({
  tag: "Reportes asignados",
  icon: <Assignment />,
  redirection: "/centros/assignments",
});

// Ítem: Asignaciones usuario
const userAssignments = new ListTemplateItem({
  tag: "Asignaciones usuario",
  icon: <PersonIcon />,
  redirection: "/user/assignments",
});

// Ítem: Historial usuario
const userHistory = new ListTemplateItem({
  tag: "Historial usuario",
  icon: <HistoryIcon />,
  redirection: "/user/history",
});

// Ítem: Estado de reportes asignados (opcional)
const status = new ListTemplateItem({
  tag: "Estado de reportes asignados",
  icon: <AssignmentReturnedIcon />,
  redirection: "/centro/status",
});

export default function ReciclajeList() {
  return (
    <ListTemplate
      items={[
        usersItem,
        asignaciones,
        userAssignments,
        userHistory, // Nuevo ítem agregado aquí
        collectRequestItem,
        // status, // puedes habilitarlo si quieres mostrarlo
      ]}
    />
  );
}
