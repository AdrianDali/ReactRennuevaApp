import ListTemplate, {ListTemplateItem} from "./ListTemplate";
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




const dashboardItem = new ListTemplateItem({
    tag: "Dashboard",
    icon: <DashboardIcon />,
    redirection: "/dash",
})




const usersItem = new ListTemplateItem({
    tag: "Usuarios",
    icon: <AccountBoxRounded />,
    subElemnets: [
        new ListTemplateItem({
            tag: "Usuario",
            icon: <PersonIcon />,
            redirection: "/users",
        }),
        new ListTemplateItem({
            tag: "Generador",
            icon: <SettingsInputComponentIcon />,
            redirection: "/generator",
        }),
        new ListTemplateItem({
            tag: "Donador",
            icon: <FavoriteIcon/>,
            redirection: "/donor",
        }),
        new ListTemplateItem({
            tag: "Conductor",
            icon: <LocalTaxiIcon />,
            redirection: "/driver",
        }),
        new ListTemplateItem({
            tag: "Transpotista",
            icon: <LocalShippingIcon />,
            redirection: "/carrier",
        }),
        new ListTemplateItem({
            tag: "Grupos",
            icon: <GroupIcon />,
            redirection: "/groups",
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
            redirection: "/report",
        }),
        new ListTemplateItem({
            tag: "Seguiemiento",
            icon: <TrackChangesIcon />,
            redirection: "/tracking",
        }),
        new ListTemplateItem({
            tag: "Historial de reportes",
            icon: <HistoryIcon />,
            redirection: "/report-history",
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
            redirection: "/recycling-center",
        }),
        new ListTemplateItem({
            tag: "Centro de acopio",
            icon: <AssignmentReturnedIcon />,
            redirection: "/collection-center",
        }),
        new ListTemplateItem({
            tag: "Compañia",
            icon: <BusinessIcon />,
            redirection: "/company",
        }),
        new ListTemplateItem({
            tag: "Vehiculo",
            icon: <DirectionsCarIcon />,
            redirection: "/vehicle",
        }),
    ]
})

const wasteItem = new ListTemplateItem({
    tag: "Residuos",
    icon: <RecyclingRounded />,
    subElemnets: [
        new ListTemplateItem({
            tag: "Residuo",
            icon: <DeleteIcon />,
            redirection: "/residue",
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
            redirection: "/donor-recolection",
        }),
    
    ]
})

export default function AdminList() {
    return (
        <ListTemplate items={[dashboardItem, usersItem, reportItem, entitiesItem, wasteItem, collectRequestItem]} />
    )
}

