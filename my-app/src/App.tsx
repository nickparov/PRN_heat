import React, { useEffect, useState } from "react";
import { Snackbar, SnackbarOrigin } from "@mui/material";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Alert, Container, Grid, Typography } from "@mui/material";
import "./App.css";

import { offerToText } from "./utils/magic";
import { History } from "./components/History";
import { processTokens } from "./utils/parser";
import { Result } from "./components/Result";
import { Controls } from "./components/Controls";

const darkTheme = createTheme({
    palette: {
        mode: "dark",
    },
});

interface SnackbarState extends SnackbarOrigin {
    open: boolean;
    msg: string;
}

function App() {
    const [processError, setProcessError] = useState<string>("");
    // Possible State
    /**
     * {
     *  code: string,
     *  result: string,
     *  history: string,
     *  loading: boolean,
     *  snackbar: 
     *      {
     *          open: boolean,
                vertical: "top",
                horizontal: "right",
                msg: string,
     *      }
     * }
     */
    /** actions: 
     * open_snackbar, 
     * close_snackbar, 
     * append_history, 
     * clear_history,
     * set_history, 
     * convert_usercode,
     * get_humantext_usercode 
     * set_usercode,
     * set_result
     * */ 

    // Inputs & Output
    const [code, setCode] = useState<string>("");
    const [result, setResult] = useState<string>("");

    // comp states
    const [history, setHistory] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [snackbar, setSnackbar] = React.useState<SnackbarState>({
        open: false,
        vertical: "top",
        horizontal: "right",
        msg: "",
    });

    useEffect(() => {
        const localHistory = JSON.parse(
            localStorage.getItem("history") || "[]"
        );

        if (localHistory && localHistory.length !== 0) {
            setHistory(localHistory);
        }
    }, []);

    // Handlers
    // Snackbar
    const openSnackbar = (givenMsg: string) => {
        if (!snackbar.open) {
            setSnackbar({ ...snackbar, open: true, msg: givenMsg });
        }
    };

    const closeSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    // History
    const updateHistory = (piece: string) => {
        const updatedHis = [...history];

        if (updatedHis.length >= 6) updatedHis.pop();

        updatedHis.unshift(piece);
        setHistory(updatedHis);

        localStorage.setItem("history", JSON.stringify(updatedHis));
    };

    const clearHistoryHandler = () => {
        localStorage.setItem("history", JSON.stringify([]));
        setHistory([]);
    };

    // Generate & Convert Handlers
    const generateHumanTextHandler = () => {
        const convertedCode = convert();
        const queryCode = convertedCode.split("\n").join(" ");

        console.log(queryCode);
        setLoading(true);

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

                const offerHumanText = offerToText(offerData);
                updateHistory(offerHumanText);
                setResult(offerHumanText);
                openSnackbar("Text Generated.");
            })
            .catch((err) => {
                console.log(err);
                setProcessError(err);
            })
            .finally(() => {
                setLoading(false);
            });
    };

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

    const convertHandler = (): void => {
        if (code.length === 0) return;

        const resultCode = convert();
        openSnackbar("Conversion done.");
        updateHistory(resultCode);
        setResult(resultCode);
    };

    // Copy Handler
    const copyHandler = () => {
        navigator.clipboard.writeText(result);
        openSnackbar("Text copied.");
    };

    const { vertical, horizontal, open, msg: snackMsg } = snackbar;

    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <div className="App">
                <Container maxWidth="lg" sx={{ py: 8 }}>
                    <Snackbar
                        open={open}
                        anchorOrigin={{ vertical, horizontal }}
                        autoHideDuration={2000}
                        onClose={closeSnackbar}
                        message={snackMsg}
                    >
                        <Alert
                            onClose={closeSnackbar}
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
                                    setResult("");
                                }}
                                sx={{ mb: 2 }}
                                severity="error"
                            >
                                Conversion error: {processError}
                            </Alert>
                        )}

                        {/* Controls Section */}
                        <Controls
                            generateHumanTextHandler={generateHumanTextHandler}
                            convertHandler={convertHandler}
                            codeChangeHandler={setCode}
                            isLoading={loading}
                            codeValue={code}
                        />

                        {/* Result Section */}
                        <Result
                            copyHandler={copyHandler}
                            setResult={setResult}
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
    );
}

export default App;
