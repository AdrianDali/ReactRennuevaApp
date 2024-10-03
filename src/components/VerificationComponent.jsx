import { Box, Divider, FormControl, FormControlLabel, FormLabel, InputLabel, MenuItem, Radio, RadioGroup, Select, TextField } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import useAuth from "../hooks/useAuth";


export default function VerificationComponent({ entry, residues, index, setVerifiedEntries, verifiedEntries }) {
    const userData = useAuth()
    const [verifiedEntry, setVerifiedEntry] = useState(
        {
            residue_id: entry.report_residue,
            checker_username: "",
            status: "",
        }
    )
    const [newPeso, setNewPeso] = useState("")
    const [newVol, setNewVol] = useState("")

    useEffect(() => {
        setVerifiedEntry({ ...entry, checker_username: userData?.user })
    }, [userData])


    useEffect(() => {
        setVerifiedEntry({ ...entry, new_m3: newVol, new_weight: newPeso })
    }, [newVol, newPeso])


    useEffect(() => {

        const updated = verifiedEntries.map(obj =>
            obj.report_residue === verifiedEntry.report_residue ? verifiedEntry : obj
        );

        setVerifiedEntries(updated)
    }, [verifiedEntry])



    const [isCorrect, setIsCorrect] = useState(null)

    useEffect(() => {
        setNewPeso("")
        setNewVol("")
        if (isCorrect) {
            setVerifiedEntry({ ...verifiedEntry, status: "VERIFICADO" })
        } else {
            setVerifiedEntry({ ...verifiedEntry, status: "REPORTADO" })
        }
    }, [isCorrect])

    const handleChange = (e) => {
        setIsCorrect(e.target.value === "false" ? false : true)
    }

    return (<>
        <Box key={index} sx={{ opacity: isCorrect === false ? 0.7 : 1 }} display="flex" flexDirection={{ md: 'row' }} justifyContent="space-between" gap={1} alignItems="center" padding={1} marginY={1} bgcolor={isCorrect === null ? "background.paper" : isCorrect ? "primary.light" : "background.warning"} borderRadius={1} paddingBottom={!isCorrect && 0} marginBottom={!isCorrect && 0}  >
            <FormControl sx={{ width: "8rem", flexGrow: 1, flexShrink: 1 }}>
                <InputLabel id='residue-current-label'>Residuo</InputLabel>
                <Select
                    inputProps={{ readOnly: true }}
                    name="residue-current"
                    labelId='residue-current-label'
                    label="Residuo"
                    value={entry.residue}
                >
                    {residues.map((residue, idx) => (
                        <MenuItem key={idx} value={residue.nombre}>{residue.nombre}</MenuItem>
                    ))}
                </Select>
            </FormControl>
            <TextField
                sx={{ width: "6rem", flexGrow: 1 }}
                name="peso"
                label="Peso (kg)"
                variant="outlined"
                type="number"
                value={entry.peso}
                onChange={() => { }}

                inputProps={{
                    readOnly: true,
                }}
            />
            <TextField
                sx={{ width: "7rem", flexGrow: 1 }}
                name="volumen"
                label="Volumen (m³)"
                variant="outlined"
                type="number"
                value={entry.volumen}

                inputProps={{
                    readOnly: true,
                }}
            />
            <FormControl >
                <FormLabel focused={false} id="verified-label" color="myText">¿Es correcto?</FormLabel>
                <RadioGroup
                    sx={{ display: 'flex', flexDirection: "row" }}
                    aria-labelledby="verified-label"
                    name="radio-buttons-verified"
                    value={isCorrect}
                    onChange={handleChange}
                >
                    <FormControlLabel value={true} control={<Radio />} label="Si" />
                    <FormControlLabel value={false} control={<Radio />} label="No" />
                </RadioGroup>
            </FormControl>
        </Box>
        {
            isCorrect === false && (
                <Box key={`verification-${index}`} display="flex" flexDirection={{ md: 'row' }} justifyContent="space-between" gap={1} alignItems="center" paddingY={2} paddingX={1} marginBottom={1} marginTop={0} bgcolor="primary.light" borderRadius={1}>
                    <FormControl sx={{ width: "8rem", flexGrow: 1, flexShrink: 1}}>
                        <InputLabel id='residue-verification-label'>Residuo</InputLabel>
                        <Select
                            hidden
                            name="residue"
                            labelId='residue-verification-label'
                            label="Residuo"
                        >
                            {residues.map((residue, idx) => (
                                <MenuItem key={`residue-${idx}`} value={residue.nombre}>{residue.nombre}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField
                        sx={{ width: "6rem", flexGrow: 1 }}
                        name="new_weight"
                        label="Nuevo peso(kg)"
                        variant="outlined"
                        type="number"
                        value={newPeso}
                        onChange={(e) => {
                            setNewPeso(e.target.value)
                        }}
                    />
                    <TextField
                        sx={{ width: "7rem", flexGrow: 1 }}
                        name="new_m3"
                        label="Nuevo volumen(m³)"
                        variant="outlined"
                        type="number"
                        value={newVol}
                        onChange={(e) => {
                            setNewVol(e.target.value)
                        }}
                    />
                    <FormControl sx={{ visibility: 'hidden' }} >
                        <FormLabel focused={false} id="verified-label" color="myText">¿Es correcto?</FormLabel>
                        <RadioGroup
                            sx={{ display: 'flex', flexDirection: "row" }}
                            aria-labelledby="verified-label"
                            name="radio-buttons-verified"
                            value={isCorrect}
                            onChange={handleChange}
                        >
                            <FormControlLabel value={true} control={<Radio />} label="Si" />
                            <FormControlLabel value={false} control={<Radio />} label="No" />
                        </RadioGroup>
                    </FormControl>
                </Box>
            )
        }
        <Divider />
    </>)
}