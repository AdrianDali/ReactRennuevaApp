import { Favorite } from "@mui/icons-material";
import { List } from "@mui/material";
import FavoriteIcon from '@mui/icons-material/Favorite';
import ListTemplate, {ListTemplateItem} from "../ListSideBar/ListTemplate";
import AssignmentReturnedIcon from '@mui/icons-material/AssignmentReturned';
import DirectionsRunRounded from '@mui/icons-material/DirectionsRunRounded';




const recoleccionItem = new ListTemplateItem({
    tag: "Recolección",
    icon: <DirectionsRunRounded />,
    subElemnets: [
        new ListTemplateItem({
            tag: "Orden recolección",
            icon: <AssignmentReturnedIcon />,
            redirection: "/donor-recollection-quality",
        }),
    ]
})

export default function QualityList() {
    return (
        <ListTemplate items={[recoleccionItem]} />
    );
}