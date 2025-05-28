import sortData from "../../helpers/SortData";
import {
    Table,
    TableHead,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Paper,
    Box,
    Typography,
    Button,
    Checkbox,
    TableSortLabel,
    IconButton,
    Menu,
    MenuItem,
    MenuList,
    ListItemIcon,
    ListItemText,
    Badge,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    DialogContentText,
    TextField,
    TablePagination,
    Collapse,
} from "@mui/material";
import {
    Add,
    Download,
    FilterList,
    Delete,
    Search,
    Visibility,
    Check,
    Edit,
    Close,
    MoreVert,
    AssignmentInd
} from "@mui/icons-material";
import theme from "../../context/theme";
import { TodoContext } from "../../context";
import React, { useState, useContext, useEffect, useRef } from "react";
import useAuth from "../../hooks/useAuth";
import { ClickAwayListener } from "@mui/base/ClickAwayListener";
import { ModalReport } from "../../pages/ModalReport";
import DeleteReportsModal from "../modals/DeleteReportsModal";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import SearchingModal from "../modals/SearchingModal";
import CustomProgressBar from "../customProgressBar";
import CentersOcuppationFiltersModal from "../modals/CentersOccupationFiltersModal";
import AssignModal from "../modals/AssignModal";


function RowContextMenu({ anchorEl, setAnchorEl }) {
    const { setOpenModalEditReport, setOpenModalDeleteReport } =
        useContext(TodoContext);
    const open = Boolean(anchorEl);

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleEdit = () => {
        setOpenModalEditReport(true);
        handleClose();
    };

    const handleDelete = () => {
        setOpenModalDeleteReport(true);
        handleClose();
    };

    return (
        <Menu anchorEl={anchorEl} open={open}>
            <ClickAwayListener onClickAway={handleClose}>
                <MenuList>
                    <MenuItem onClick={handleEdit}>
                        <ListItemIcon>
                            <Edit />
                        </ListItemIcon>
                        <ListItemText primary="Editar" />
                    </MenuItem>
                    <MenuItem onClick={handleDelete}>
                        <ListItemIcon>
                            <Delete color="error" />
                        </ListItemIcon>
                        <ListItemText primary="Borrar" />
                    </MenuItem>
                </MenuList>
            </ClickAwayListener>
        </Menu>
    );
}

function Toolbar({
    selected,
    setOpenFiltersModal,
    filtersApplied,
    filteredData,
    allData,
    setVisibleData,
    folios
}) {
    const [openAssignModal, setOpenAssignModal] = useState(false);
    const userData = useAuth();
    return (
        <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
            py={2}
        >
            <Typography variant="h4" component="div" color="primary" sx={{ p: 2, flexShrink: 2 }}>
                Uso de centros de acopio
            </Typography>
            <Box sx={{ flexGrow: 1, flexShrink: 0, display: "flex", flexDirection: "row", justifyContent: "end" }}>
                <SearchField
                    filteredData={filteredData}
                    setVisibleData={setVisibleData}
                />
                <Badge
                    color="error"
                    overlap="circular"
                    badgeContent=" "
                    variant="dot"
                    invisible={!filtersApplied}
                >
                    <Button
                        variant="text"
                        size="large"
                        color="secondary"
                        startIcon={<FilterList />}
                        sx={{ m: 0, mx: 2 }}
                        onClick={() => setOpenFiltersModal(true)}
                    >
                        Filtrar
                    </Button>
                </Badge>
                <Button
                    variant="contained"
                    size="large"
                    color="primary"
                    startIcon={<AssignmentInd />}
                    sx={{ m: 0, mx: 2 }}
                    onClick={() => setOpenAssignModal(true)}
                >
                    Asignar
                </Button>
            </Box>
            <AssignModal setOpen={setOpenAssignModal} isOpen={openAssignModal} center={userData?.recycling_center} />
        </Box>
    );
}

function MobileToolbar({
    selected,
    setOpenFiltersModal,
    filtersApplied,
    filteredData,
    allData,
    setVisibleData,
}) {
    const [anchorEl, setAnchorEl] = useState(null);
    const [openSearchModal, setOpenSearchModal] = useState(false)
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleFilter = (e) => {
        setOpenFiltersModal(true);
        handleClose();
    }

    const handleSearch = (e) => {
        setOpenSearchModal(true);
        handleClose();
    }

    return (
        <>
            <Box
                display="flex"
                flexDirection="row"
                justifyContent="space-between"
                alignItems="center"
                py={2}
            >
                <Typography variant="h4" component="div" color="primary" sx={{ p: 2, flexShrink: 2 }}>
                    Ocupación de centros de acopio
                </Typography>
                <Box sx={{ flexGrow: 1, flexShrink: 0, display: "flex", flexDirection: "row", justifyContent: "end" }}>
                    <IconButton
                        aria-label="more"
                        id="long-button"
                        aria-controls={open ? 'long-menu' : undefined}
                        aria-expanded={open ? 'true' : undefined}
                        aria-haspopup="true"
                        onClick={handleClick}
                    >
                        <MoreVert />
                    </IconButton>
                    <Menu
                        id="long-menu"
                        MenuListProps={{
                            'aria-labelledby': 'long-button',
                        }}
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        slotProps={{
                            paper: {
                                style: {
                                    maxHeight: 48 * 4.5,
                                    width: '15ch',
                                },
                            },
                        }}
                    >
                        <MenuList>
                            <Badge
                                color="error"
                                overlap="circular"
                                badgeContent=" "
                                variant="dot"
                                invisible={!filtersApplied}
                            >
                                <MenuItem onClick={handleFilter} color="info">
                                    <ListItemIcon >
                                        <FilterList />
                                    </ListItemIcon>
                                    <ListItemText primary="Filtrar" />
                                </MenuItem>
                            </Badge>
                            <MenuItem onClick={handleSearch}>
                                <ListItemIcon>
                                    <Search />
                                </ListItemIcon>
                                <ListItemText primary="Buscar" />
                            </MenuItem>
                        </MenuList>

                    </Menu>
                </Box>
            </Box>
            <SearchingModal isOpen={openSearchModal} setOpen={setOpenSearchModal} filteredData={filteredData} setVisibleData={setVisibleData} />
        </>
    )

}

function SearchField({ filteredData, setVisibleData }) {
    const [showSearch, setShowSearch] = useState(false);
    const searchInputRef = useRef();
    const searchButtonRef = useRef();
    const [searchValue, setSearchValue] = useState("");
    useEffect(() => {
        if (showSearch) {
            searchInputRef.current.focus();
        }
    }, [showSearch]);

    const handleSearch = (e) => {
        if (e.key === "Enter") {
            const search = searchValue.trim().toLowerCase();
            if (search === "") {
                setVisibleData(filteredData);
            } else {
                const newData = filteredData.filter((center) => {
                    return (
                        center.collection_center_name.toLowerCase().includes(search)
                    );
                });
                setVisibleData(newData);
            }
        }
    };

    return (
        <>
            <ClickAwayListener
                onClickAway={(e) => {
                    if (e.target !== searchButtonRef.current && searchValue === "") {
                        setShowSearch(false);
                        setVisibleData(filteredData);
                    }
                }}
            >
                <TextField
                    color="info"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    id="search-field"
                    inputRef={searchInputRef}
                    label="Buscar"
                    variant="standard"
                    size="small"
                    sx={{
                        width: showSearch ? "15rem" : 0,
                        transition: "all 300ms ease-in",
                        maxWidth: "100%",
                    }}
                    placeholder="Nombre del centro"
                    onKeyUp={handleSearch}
                />
            </ClickAwayListener>
            <IconButton
                color={showSearch ? "error" : "info"}
                ref={searchButtonRef}
                onClick={(e) => {
                    e.stopPropagation();
                    if (!showSearch) return setShowSearch(true);
                    setSearchValue("");
                    setVisibleData(filteredData);
                    setShowSearch(false);
                }}
            >
                {showSearch ? <Close /> : <Search />}
            </IconButton>
        </>
    );
}

export default function CollectionsCentersTable({ data }) {
    const [filteredData, setFilteredData] = useState(data);
    const [reportsToDelete, setReportsToDelete] = useState([]);
    const [filtersApplied, setFiltersApplied] = useState(false);
    const [visibleData, setVisibleData] = useState(data);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [orderBy, setOrderBy] = useState("collection_center_name");
    const [order, setOrder] = useState("desc");
    const [sortedData, setSortedData] = useState([]);
    const dataUser = useAuth();
    const {
        openModalCreateReport,
        openModalText,
        textOpenModalText,
        setOpenModalText,
        setUpdateReportInfo,
    } = useContext(TodoContext);
    const [rowContextMenuAnchorEl, setRowContextMenuAnchorEl] = useState(null);
    const [selected, setSelected] = useState([]);
    const [openFiltersModal, setOpenFiltersModal] = useState(false);
    const [expandedRow, setExpandedRow] = useState(null);
    const [desktop, setDesktop] = useState(window.innerWidth > 899);
    const uniqueFolios = []

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 899) {
                setDesktop(true);
            } else {
                setDesktop(false);
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        }
    }, []);

    const handleExpandClick = (id) => {
        setExpandedRow((prev) => (prev === id ? null : id));
    };

    const [dataForFilters, setDataForFilters] = useState({
        max_kg: [],
        max_m3: [],
        total_kg: [],
        total_m3: [],
    });

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };


    useEffect(() => {
        setSelected([]);
        setFilteredData(data);
        setVisibleData(data);
        if (data.length > 0) {
            const max_kg = [
                ...new Set(data.map((center) => center.max_kg)),
            ];

            const max_m3 = [
                ...new Set(data.map((center) => center.max_kg)),
            ];

            const total_kg = [
                ...new Set(data.map((center) => center.max_kg)),
            ];

            const total_m3 = [
                ...new Set(data.map((center) => center.max_kg)),
            ];


            setDataForFilters({
                max_kg,
                max_m3,
                total_kg,
                total_m3,
            });
        }
    }, [data]);

    useEffect(() => {
        const sortedData = sortData(visibleData, orderBy, order);
        setSortedData(sortedData);
    }, [visibleData, order, orderBy])


    return (
        <Box sx={{
        width: "100%",
        mb: "3rem",
        height: "80vh",
        display: "flex",
        flexDirection: "column",
      }}>
            <Paper
                sx={{
          borderRadius: 2, // esquinas redondeadas
          boxShadow: 1, // sombra ligera
          p: 2, // padding interno
          bgcolor: "background.paper",
        }}
            >
                {desktop ? (
                    <Toolbar
                        folios={uniqueFolios}
                        selected={selected}
                        allData={data}
                        filteredData={filteredData}
                        setOpenFiltersModal={setOpenFiltersModal}
                        setObjectsToDelete={setReportsToDelete}
                        filtersApplied={filtersApplied}
                        setVisibleData={setVisibleData}
                    />
                ) : (
                    <MobileToolbar
                        selected={selected}
                        allData={data}
                        filteredData={filteredData}
                        setOpenFiltersModal={setOpenFiltersModal}
                        setObjectsToDelete={setReportsToDelete}
                        filtersApplied={filtersApplied}
                        setVisibleData={setVisibleData}
                    />
                )}
                <TableContainer sx={{
            maxHeight: "calc(70vh - 64px)", // ajusta según tu Toolbar/TablePagination
            overflowY: "auto",
            "&::-webkit-scrollbar": { width: 6 },
            "&::-webkit-scrollbar-thumb": {
              bgcolor: "grey.400",
              borderRadius: 3,
            },
          }}>
                    <Table >
                        <TableHead sx={{
                bgcolor: "primary.main",
                "& .MuiTableCell-root": {
                  color: "common.white",
                  borderBottom: "2px solid",
                  borderColor: "primary.dark",
                  "& .MuiTableSortLabel-root:hover .MuiTableSortLabel-icon": {
                    opacity: 1,
                  },
                },
              }}>
                            <TableRow>
                                <TableCell>
                                    <TableSortLabel direction="asc">
                                        <Typography variant="subtitle2"></Typography>
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>
                                    <TableSortLabel
                                        direction={order}
                                        onClick={() => {
                                            setOrderBy("collection_center_name")
                                            setOrder(order === "asc" ? "desc" : "asc")
                                        }}
                                        active={orderBy === "collection_center_name" ? true : false}
                                    >
                                        <Typography variant="subtitle2">Nombre</Typography>
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>
                                    <TableSortLabel direction="asc">
                                        <Typography variant="subtitle2">Peso máximo (Kg)</Typography>
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>
                                    <TableSortLabel direction="asc">
                                        <Typography variant="subtitle2">Peso actual (Kg)</Typography>
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>
                                    <TableSortLabel direction="asc">
                                        <Typography variant="subtitle2">Volumen máximo (m<sup>3</sup>)</Typography>
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="subtitle2">Volumen actual (m<sup>3</sup>)</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="subtitle2">Peso ocupado</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="subtitle2">Volumen ocupado</Typography>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {sortedData.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7}>
                                        <Typography
                                            variant="h6"
                                            color="textSecondary"
                                            align="center"
                                        >
                                            No se encontraron reportes
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                sortedData
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((center, index) => (
                                        <React.Fragment key={`${index}-${center.collection_center_name.replace(" ", "_")}`}>
                                            <TableRow
                                                hover
                                                role="checkbox"
                                                key={center.collection_center_name}
                                                sx={{ cursor: "pointer" }}

                                            >
                                                <TableCell>
                                                    <Button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleExpandClick(center.collection_center_name);
                                                        }}
                                                    >
                                                        {expandedRow === center.collection_center_name ? (
                                                            <KeyboardArrowUpIcon />
                                                        ) : (
                                                            <KeyboardArrowDownIcon />
                                                        )}
                                                    </Button>
                                                </TableCell>
                                                <TableCell>{center.collection_center_name}</TableCell>
                                                <TableCell>{`${center.max_kg} Kg`}</TableCell>
                                                <TableCell>{`${center.total_kg} Kg`}</TableCell>
                                                <TableCell>{`${center.max_m3} m`}<sup>3</sup></TableCell>
                                                <TableCell>{`${center.total_m3} m`}<sup>3</sup></TableCell>
                                                <TableCell align="center" width={140}>
                                                    <CustomProgressBar value={(center.total_kg * 100) / center.max_kg} />
                                                    <Typography variant="subtitle2">{`${Math.round((center.total_kg * 100) / center.max_kg)} %`}</Typography>
                                                </TableCell>
                                                <TableCell align="center" width={140}>
                                                    <CustomProgressBar value={(center.total_m3 * 100) / center.max_m3} />
                                                    <Typography variant="subtitle2">{`${Math.round((center.total_m3 * 100) / center.max_m3)} %`}</Typography>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell
                                                    style={{ paddingBottom: 0, paddingTop: 0, border: "none" }}
                                                    colSpan={18}
                                                >
                                                    <Collapse
                                                        in={expandedRow === center.collection_center_name}
                                                        timeout="auto"
                                                        unmountOnExit
                                                    >
                                                        <Box sx={{ margin: 1 }}>
                                                            <Typography variant="h5" gutterBottom component="div">
                                                                Folios
                                                            </Typography>
                                                            <ul>
                                                                {
                                                                    center.details.map((detail, index) => {
                                                                        if (!uniqueFolios.includes(detail.ReportFolio)) {
                                                                            uniqueFolios.push(detail.ReportFolio)
                                                                            return (
                                                                                <Typography variant="body1" gutterBottom component="div" key={`folio-${detail.ReportFolio}-${index}`}>
                                                                                    {index + 1}. {detail.ReportFolio ? detail.ReportFolio : "Sin folio"}
                                                                                </Typography>
                                                                            )
                                                                        }
                                                                    })
                                                                }
                                                            </ul>
                                                        </Box>
                                                    </Collapse>
                                                </TableCell>
                                            </TableRow>
                                        </React.Fragment>
                                    ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 15, 20]}
                    component="div"
                    count={sortedData.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>

            <DeleteReportsModal reports={reportsToDelete} />
            <CentersOcuppationFiltersModal
                isOpen={openFiltersModal}
                setOpen={setOpenFiltersModal}
                data={dataForFilters}
                setFilteredData={setFilteredData}
                objects={data}
                setFiltersApplied={setFiltersApplied}
            />
            <RowContextMenu
                anchorEl={rowContextMenuAnchorEl}
                setAnchorEl={setRowContextMenuAnchorEl}
            />
            {
                openModalCreateReport && (
                    <ModalReport mode={"CREAR"} creatorUser={dataUser.user} />
                )
            }
            {
                openModalText && (
                    <Dialog
                        open={openModalText}
                        onClose={() => {
                            setOpenModalText(false);
                            setUpdateReportInfo((prev) => !prev);
                        }}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogTitle id="alert-dialog-title">{textOpenModalText}</DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                {textOpenModalText}
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setOpenModalText(false)}>Aceptar</Button>
                        </DialogActions>
                    </Dialog>
                )
            }
        </Box >
    );
}