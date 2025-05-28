import ListTemplate, {ListTemplateItem} from "./ListSideBar/ListTemplate";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonIcon from '@mui/icons-material/Person';
import DeleteIcon from '@mui/icons-material/Delete';
import AssignmentReturnedIcon from '@mui/icons-material/AssignmentReturned';
import SettingsInputComponentIcon from '@mui/icons-material/SettingsInputComponent';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocalTaxiIcon from '@mui/icons-material/LocalTaxi';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import GroupIcon from '@mui/icons-material/Group';
import BarChartIcon from '@mui/icons-material/BarChart';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import HistoryIcon from '@mui/icons-material/History';
import BusinessIcon from '@mui/icons-material/Business';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import { AccountBoxRounded, Assignment, DirectionsRunRounded, HomeWorkRounded, RecyclingRounded } from "@mui/icons-material";
import { redirect } from "react-router-dom";
import { Recycling } from "@mui/icons-material";




const usersItem = new ListTemplateItem({
    tag: "Centros de acopio",
    icon: <Recycling />,
    redirection: '/centrosAcopio'
})

const asignaciones = new ListTemplateItem({
    tag: "Reportes asignados",
    icon: <Assignment />,
    redirection: '/sub-centro/assignments'
}, 
)

const status = new ListTemplateItem({
    tag: "Estado de reportes asignados",
    icon: <AssignmentReturnedIcon />,
    redirection: '/centro/status'
})

const collectRequestItem = new ListTemplateItem({
    tag: "Recolección",
    icon: <DirectionsRunRounded />,
    subElemnets: [
        new ListTemplateItem({
            tag: "Reporte Donadores",
            icon: <AssignmentReturnedIcon />,
            redirection: "/sub-centro/home",
        })
    
    ]
})

export default function SubReciclajeList() {
    return (
        <ListTemplate items={[ asignaciones, collectRequestItem ]} />
    )
}
