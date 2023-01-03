import React, { useEffect, useReducer, useState } from "react";
import { Snackbar, SnackbarOrigin, TextField } from "@mui/material";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Alert, Container, Grid, Typography } from "@mui/material";
import "./App.css";

import { offerToText } from "./utils/magic";
import { History } from "./components/History";
import { processTokens } from "./utils/parser";
import { Result } from "./components/Result";
import { Controls } from "./components/Controls";

import * as appActionCreators from "./actions/App/actionCreators";

import appReducer, {
    appAction,
    initialState as initialAppState,
} from "./reducers/app";

// Move away
import { createContext } from "react";

export const AppDispatchContext = createContext<React.Dispatch<appAction> | null>(null);

const darkTheme = createTheme({
    palette: {
        mode: "dark",
    },
});

function App() {
    const [processError, setProcessError] = useState<string>("");

    // App State
    const [appState, dispatch] = useReducer(appReducer, initialAppState);
    const { code, history, result, loading } = appState;

    // action creators
    const {
        doAppendHistory,
        doSetResult,
        doOpenSnackbar,
        doSetLoading,
        doCloseSnackbar,
        doClearHistory,
        doGetHumanTextUserCode,
        doSetUserCode,
        doSetHistory,
    } = appActionCreators;

    // once
    useEffect(() => {
        const localHistory = JSON.parse(
            localStorage.getItem("history") || "[]"
        );

        if (localHistory && localHistory.length !== 0) {
            dispatch(doSetHistory(localHistory));
        }
    }, []);

    // const localHistory = JSON.parse(localStorage.getItem("history") || "[]");

    // if (localHistory && localHistory.length !== 0) {
    //     dispatch(doSetHistory(localHistory));
    // }

    useEffect(() => {
        localStorage.setItem("history", JSON.stringify(history));
    }, [history]);

    const convert = (): string => {
        const trueLines: string[] = [];
        // _ or __: AM/PM
        const lines = code.split("\n").map((el) => {
            return el;
        });

        // console.log(convertTime12To24("3:44 AM"));
        lines.forEach((line) => {
            try {
                const trueLine = processTokens(line.split(" ")).join(" ");
                trueLines.push(trueLine);
            } catch (error) {
                console.error(error);
            }
        });

        return trueLines.join("\n");
    };

    // Handlers
    const closeSnackbarHandler = () => {
        dispatch(doCloseSnackbar());
    };

    const clearHistoryHandler = () => {
        localStorage.setItem("history", JSON.stringify([]));
        dispatch(doClearHistory());
    };

    const setResultHandler = (value: string) => {
        dispatch(doSetResult(value));
    };

    const generateHumanTextHandler = () => {
        const convertedCode = convert();
        const queryCode = convertedCode.split("\n").join(" ");

        console.log(queryCode);

        dispatch(doSetLoading(true));

        fetch("https://us-central1-pnrconverter.cloudfunctions.net/main", {
            method: "POST",
            headers: {
                "content-type": "application/json;charset=UTF-8",
            },
            body: JSON.stringify({
                query: queryCode,
            }),
        })
            .then((res) => {
                if (!res.ok) {
                    setProcessError("Server Error.");
                    return null;
                }
                return res.json();
            })
            .then((offerData) => {
                if (!offerData) return;

                const offerHumanText = offerToText(offerData.offer);

                dispatch(doAppendHistory(offerHumanText));
                dispatch(doSetResult(offerHumanText));
                dispatch(doOpenSnackbar("Text Generated."));
                dispatch(doSetLoading(false));
            })
            .catch((err) => {
                console.log(err);
                setProcessError(err);
            })
            .finally(() => {
                dispatch(doGetHumanTextUserCode());
            });
    };

    const convertHandler = (): void => {
        if (appState.code.length === 0) return;

        const resultCode = convert();
        dispatch(doOpenSnackbar("Conversion done."));
        dispatch(doAppendHistory(resultCode));
        dispatch(doSetResult(resultCode));
    };

    const copyHandler = () => {
        navigator.clipboard.writeText(appState.result);
        dispatch(doOpenSnackbar("Text copied."));
    };

    const { snackbar } = appState;
    const { vertical, horizontal, open, msg: snackMsg } = snackbar;

    return (
        <AppDispatchContext.Provider value={dispatch}>
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
                                        dispatch(doSetUserCode(e.target.value))
                                    }
                                    inputProps={{ "data-testid": "textarea" }}
                                />
                            </Grid>

                            {/* Controls Section */}
                            <Controls
                                generateHumanTextHandler={
                                    generateHumanTextHandler
                                }
                                convertHandler={convertHandler}
                                isLoading={loading}
                                codeValue={code}
                            />

                            {/* Result Section */}
                            <Result
                                copyHandler={copyHandler}
                                setResult={setResultHandler}
                                result={result}
                            />

                            {/* History Section */}
                            <History
                                clearHandler={clearHistoryHandler}
                                history={history}
                            />
                        </Grid>
                    </Container>
                </div>
            </ThemeProvider>
        </AppDispatchContext.Provider>
    );
}

export default App;
