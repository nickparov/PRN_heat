import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { Grid, Typography, TextField, Button } from "@mui/material";
import { useContext } from "react";
import {
    doOpenSnackbar,
    doReset,
    doSetResult,
} from "../actions/App/actionCreators";
import { AppDispatchContext, AppStateContext } from "../App";
import { appDispatchFunc, appStateInterface } from "../reducers/app";

const Result = () => {
    const dispatch = useContext(AppDispatchContext) as appDispatchFunc;
    const { result } = useContext(AppStateContext) as appStateInterface;

    const copyHandler = () => {
        navigator.clipboard.writeText(result);
        dispatch(doOpenSnackbar("Text copied."));
    };

    const resetHandler = () => {
        dispatch(doReset());
    };

    const InputHandler = (value: string) => {
        dispatch(doSetResult(value));
    };

    return (
        <Grid item>
            <Typography variant="h3" gutterBottom>
                Result
            </Typography>
            <TextField
                fullWidth
                id="outlined-basic"
                variant="outlined"
                multiline={true}
                rows={9}
                value={result}
                onChange={(e) => InputHandler(e.target.value)}
                inputProps={{ "data-testid": "resultarea" }}
            />
            <Button
                sx={{ mt: 2 }}
                variant="outlined"
                onClick={copyHandler}
                fullWidth
                size="large"
                disabled={result.length === 0}
            >
                <ContentCopyIcon sx={{ mr: 1 }} />
                Copy
            </Button>
            <Button
                sx={{ mt: 1 }}
                variant="outlined"
                onClick={resetHandler}
                fullWidth
                size="large"
                disabled={result.length === 0}
            >
                <RestartAltIcon sx={{ mr: 1 }} />
                Reset
            </Button>
        </Grid>
    );
};

export { Result };
