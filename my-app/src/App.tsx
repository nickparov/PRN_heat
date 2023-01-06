import React, { useEffect, useReducer, useState } from "react";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Alert, Container, Grid, Typography } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { Snackbar, TextField } from "@mui/material";
import "./App.css";

import { Controls } from "./components/Controls";
import { History } from "./components/History";
import { Result } from "./components/Result";

import * as appActionCreators from "./actions/App/actionCreators";

import appReducer, {
    appAction,
    appStateInterface,
    initialState as initialAppState,
} from "./reducers/app";

// Move away
import { createContext } from "react";

export const AppDispatchContext =
    createContext<React.Dispatch<appAction> | null>(null);
export const AppStateContext = createContext<appStateInterface | null>(null);

const darkTheme = createTheme({
    palette: {
        mode: "dark",
    },
});

function App() {
    const [processError, setProcessError] = useState<string>("");

    // App State
    const [appState, dispatch] = useReducer(appReducer, initialAppState);
    const { code, history } = appState;

    // action creators
    const { doSetResult, doCloseSnackbar, doSetUserCode, doSetHistory } =
        appActionCreators;

    // once
    useEffect(() => {
        const localHistory = JSON.parse(
            localStorage.getItem("history") || "[]"
        );

        if (localHistory && localHistory.length !== 0) {
            dispatch(doSetHistory(localHistory));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("history", JSON.stringify(history));
    }, [history]);

    // Handlers
    const closeSnackbarHandler = () => {
        dispatch(doCloseSnackbar());
    };

    const { snackbar } = appState;
    const { vertical, horizontal, open, msg: snackMsg } = snackbar;

    return (
        <AppDispatchContext.Provider value={dispatch}>
            <AppStateContext.Provider value={appState}>
                <ThemeProvider theme={darkTheme}>
                    <CssBaseline />
                    <div className="App">
                        <Container maxWidth="lg" sx={{ py: 8 }}>
                            <Snackbar
                                open={open}
                                anchorOrigin={{ vertical, horizontal }}
                                autoHideDuration={2000}
                                onClose={closeSnackbarHandler}
                                message={snackMsg}
                            >
                                <Alert
                                    onClose={closeSnackbarHandler}
                                    severity="success"
                                    sx={{ width: "100%" }}
                                >
                                    {snackMsg}
                                </Alert>
                            </Snackbar>

                            <Grid
                                container
                                spacing={2}
                                sx={{
                                    mt: 8,
                                    flexDirection: "column",
                                    justifyContent: "center",
                                }}
                            >
                                {/* Header Section */}
                                <Typography variant="h3" gutterBottom>
                                    Convert or Get Text from PNR
                                    <Typography
                                        variant="overline"
                                        display="block"
                                        gutterBottom
                                    >
                                        Читаем ваши мысли <br />
                                    </Typography>
                                </Typography>

                                {/* Prosessing Errors */}
                                {processError !== "" && (
                                    <Alert
                                        onClose={() => {
                                            setProcessError("");
                                            dispatch(doSetResult(""));
                                        }}
                                        sx={{ mb: 2 }}
                                        severity="error"
                                    >
                                        Conversion error: {processError}
                                    </Alert>
                                )}

                                {/* Form Input Section */}
                                <Grid item>
                                    <TextField
                                        fullWidth
                                        id="outlined-basic"
                                        label="PRN Code"
                                        variant="outlined"
                                        placeholder="Enter your code here."
                                        multiline={true}
                                        rows={6}
                                        value={code}
                                        onChange={(e) =>
                                            dispatch(
                                                doSetUserCode(e.target.value)
                                            )
                                        }
                                        inputProps={{
                                            "data-testid": "textarea",
                                        }}
                                    />
                                </Grid>

                                {/* Controls Section */}
                                <Controls setProcessError={setProcessError} />

                                {/* Result Section */}
                                <Result />

                                {/* History Section */}
                                <History />
                            </Grid>
                        </Container>
                    </div>
                </ThemeProvider>
            </AppStateContext.Provider>
        </AppDispatchContext.Provider>
    );
}

export default App;
