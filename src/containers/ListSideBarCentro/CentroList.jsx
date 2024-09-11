import ListTemplate, {ListTemplateItem} from "../ListSideBar/ListTemplate";
import AssignmentReturnedIcon from '@mui/icons-material/AssignmentReturned';

import { DirectionsRunRounded, RecyclingRounded} from "@mui/icons-material";

const collectRequestItem = new ListTemplateItem({
    tag: "Recolección",
    icon: <DirectionsRunRounded />,
    subElemnets: [
        new ListTemplateItem({
            tag: "Reporte Donadores",
            icon: <AssignmentReturnedIcon />,
            redirection: "/centro/home",
        })
    
    ]
})

export default function CentroList() {
    return (
        <ListTemplate items={[ collectRequestItem, new ListTemplateItem({
            tag: "Residuos",
            icon: <RecyclingRounded />,
            redirection: "/centro/residuos",
        }),]} />
    )
}

