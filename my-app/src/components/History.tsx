import { Button, Grid, Typography } from "@mui/material";
import { useContext } from "react";
import { doClearHistory } from "../actions/App/actionCreators";
import { AppDispatchContext, AppStateContext } from "../App";
import { appDispatchFunc, appStateInterface } from "../reducers/app";
import { SingleHistory } from "./SingleHistory";

const History = () => {
    const dispatch = useContext(AppDispatchContext) as appDispatchFunc;
    const { history } = useContext(AppStateContext) as appStateInterface;

    const clearHistoryHandler = () => {
        localStorage.setItem("history", JSON.stringify([]));
        dispatch(doClearHistory());
    };

    if (history.length === 0) {
        return null;
    }

    return (
        <Grid sx={{ mt: 12 }} item>
            <Typography sx={{ mt: 4 }} variant="h4">
                History
            </Typography>
            <Typography variant="caption">Click to copy.</Typography>
            <Grid container sx={{ mt: 1 }} spacing={2}>
                {history.map((snapshot, idx) => (
                    <SingleHistory content={snapshot} key={idx} />
                ))}
            </Grid>
            <Button
                onClick={clearHistoryHandler}
                sx={{ mt: 2 }}
                variant="outlined"
                size={"large"}
            >
                Clear
            </Button>
        </Grid>
    );
};

export { History };
