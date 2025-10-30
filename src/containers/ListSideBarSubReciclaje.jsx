import ListTemplate, { ListTemplateItem } from "./ListSideBar/ListTemplate";
import AssignmentReturnedIcon from '@mui/icons-material/AssignmentReturned';

import { AccountBoxRounded, Assignment, DirectionsRunRounded, HomeWorkRounded, RecyclingRounded } from "@mui/icons-material";
import { Recycling } from "@mui/icons-material";



const asignaciones = new ListTemplateItem({
    tag: "Reportes asignados",
    icon: <Assignment />,
    redirection: '/sub-centro/assignments'
});



const collectRequestItem = new ListTemplateItem({
    tag: "Recolección",
    icon: <DirectionsRunRounded />,
    subElemnets: [
        new ListTemplateItem({
            tag: "Reporte Donadores",
            icon: <AssignmentReturnedIcon />,
            redirection: "/sub-centro/user-assignments",
        })]
});

export default function SubReciclajeList() {
    return (
        <ListTemplate items={[ asignaciones, collectRequestItem ]} />
    );
}
