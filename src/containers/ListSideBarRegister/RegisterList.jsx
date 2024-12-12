import ListTemplate, {ListTemplateItem} from "../ListSideBar/ListTemplate";
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
import { AccountBoxRounded, DirectionsRunRounded, HomeWorkRounded, RecyclingRounded } from "@mui/icons-material";




const usersItem = new ListTemplateItem({
    tag: "Usuarios",
    icon: <AccountBoxRounded />,
    subElemnets: [
        
        new ListTemplateItem({
            tag: "Generador",
            icon: <SettingsInputComponentIcon />,
            redirection: "/register/generator",
        }),
        new ListTemplateItem({
            tag: "Donador",
            icon: <FavoriteIcon/>,
            redirection: "/register/donor",
        }),
        new ListTemplateItem({
            tag: "Conductor",
            icon: <LocalTaxiIcon />,
            redirection: "/register/driver",
        }),
        new ListTemplateItem({
            tag: "Transpotista",
            icon: <LocalShippingIcon />,
            redirection: "/register/carrier",
        }),
    ]
})


const reportItem = new ListTemplateItem({
    tag: "Reportes",
    icon: <BarChartIcon />,
    subElemnets: [
        new ListTemplateItem({
            tag: "Reporte",
            icon: <BarChartIcon />,
            redirection: "/register/report",
        }),
        new ListTemplateItem({
            tag: "Seguimineto",
            icon: <TrackChangesIcon />,
            redirection: "/register/tracking",
        }),
        new ListTemplateItem({
            tag: "Historial de reportes",
            icon: <HistoryIcon />,
            redirection: "/register/report-history",
        }),
    ]
})


const entitiesItem = new ListTemplateItem({
    tag: "Entidades",
    icon: <HomeWorkRounded/>,
    subElemnets: [
        new ListTemplateItem({
            tag: "Centro de Reciclaje",
            icon: <DeleteIcon />,
            redirection: "/register/recycling-center",
        }),
        new ListTemplateItem({
            tag: "Centro de Recolección",
            icon: <AssignmentReturnedIcon />,
            redirection: "/register/collection-center",
        }),
        new ListTemplateItem({
            tag: "Vehículo",
            icon: <DirectionsCarIcon />,
            redirection: "/register/vehicle",
        }),
    ]
})



const collectRequestItem = new ListTemplateItem({
    tag: "Recolección",
    icon: <DirectionsRunRounded />,
    subElemnets: [
        new ListTemplateItem({
            tag: "Orden recolección",
            icon: <AssignmentReturnedIcon />,
            redirection: "/register/donor-recollection",
        }),
    
    ]
})

export default function RegisterList() {
    return (
        <ListTemplate items={[ usersItem, reportItem, entitiesItem, collectRequestItem]} />
    )
}

