import * as React from "react";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import {
    FormControl,
    InputAdornment,
    InputLabel,
    OutlinedInput,
} from "@mui/material";
import { AppDispatchContext, AppStateContext } from "../App";
import { appDispatchFunc, appStateInterface } from "../reducers/app";
import { doSetLuggage, doSetPrice } from "../actions/App/actionCreators";

// Цена: 100 | Багаж включен

export default function SwitchLabels() {
    const { price, luggage } = React.useContext(
        AppStateContext
    ) as appStateInterface;

    const dispatch = React.useContext(AppDispatchContext) as appDispatchFunc;

    return (
        <FormGroup row>
            <FormControl sx={{ mt: 1, ml: 2 }}>
                <InputLabel htmlFor="outlined-adornment-amount">
                    Price
                </InputLabel>
                <OutlinedInput
                    id="outlined-adornment-amount"
                    startAdornment={
                        <InputAdornment position="start">$</InputAdornment>
                    }
                    label="Amount"
                    value={price}
                    onChange={(e) => {
                        dispatch(
                            doSetPrice(
                                e.target.value ? parseInt(e.target.value) : 0
                            )
                        );
                    }}
                />
            </FormControl>
            <FormControlLabel
                sx={{
                    border: "1px solid rgba(256,256,256,0.2)",
                    borderRadius: "4px",
                    maxHeight: "55px",
                    mt: "8px",
                    pl: "9px",
                }}
                control={
                    <Switch
                        onChange={(e) => {
                            dispatch(doSetLuggage(e.target.checked));
                        }}
                        checked={luggage}
                    />
                }
                label="Багаж"
                labelPlacement="start"
            />
        </FormGroup>
    );
}
