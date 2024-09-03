import ResiduesReportsTable from "../../components/boards/ResiduesReportsTable";
import { Container} from "@mui/material";
import { TodoContext } from "../../context";
import { useState, useContext, useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import axios from "axios";
import CollectionsCentersTable from "../../components/boards/CollectionsCentersTable";
import CollectionCentersOccupation from "../../Charts/CollectionCentersOccupation";

export default function CollectionCenterMenu() {
    const [collectionCenters, setCollectionsCenters] = useState([]);
    const { updateCollectionCenterInfo, setUpdateCollectionCenterInfo} = useContext(TodoContext);
    const dataUser = useAuth();

    useEffect(() => {
        if (!dataUser) return;
        axios
            .get(`${process.env.REACT_APP_API_URL}/all-collection-center-residue-summary/`)
            .then((response) => {
                console.log(response.data);
                setCollectionsCenters(response.data.centers);
            })
            .catch((error) => {
                console.error(error);
            });
    }, [updateCollectionCenterInfo, dataUser]);

    return (
        <Container
            maxWidth={false}
            sx={{
                flexGrow: 1,
                overflow: "auto",
                py: 3,
                height: "100%",
            }}
        >
            <CollectionsCentersTable data={collectionCenters} />
            <CollectionCentersOccupation centers={collectionCenters} />

        </Container>
    );
}