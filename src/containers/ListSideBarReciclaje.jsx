import ListTemplate, { ListTemplateItem } from "./ListSideBar/ListTemplate";
import { 
  Assignment, 
  AssignmentReturned as AssignmentReturnedIcon, 
  DirectionsRunRounded, 
  Recycling, 
  Person as PersonIcon // Importar el icono de usuario
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

// Ítem NUEVO: Asignaciones usuario
const userAssignments = new ListTemplateItem({
  tag: "Asignaciones usuario",
  icon: <PersonIcon />, // Aquí el icono de usuario
  redirection: "/user/assignments",
});

// Ítem: Estado de reportes asignados (si lo quieres agregar)
const status = new ListTemplateItem({
  tag: "Estado de reportes asignados",
  icon: <AssignmentReturnedIcon />,
  redirection: "/centro/status",
});

export default function ReciclajeList() {
  return (
    <ListTemplate items={[
      usersItem, 
      asignaciones, 
      userAssignments, // Nuevo ítem aquí
      collectRequestItem,
      // Puedes agregar "status" aquí si lo deseas: 
      //status
    ]} />
  );
}
