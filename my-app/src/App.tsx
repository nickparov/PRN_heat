import React, { useState } from "react";

import LoadingButton from "@mui/lab/LoadingButton";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import CachedIcon from "@mui/icons-material/Cached";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import {
    Alert,
    Button,
    Container,
    Grid,
    TextField,
    Typography,
} from "@mui/material";
import "./App.css";

import { offerToText } from "./utils/magic";

const darkTheme = createTheme({
    palette: {
        mode: "dark",
    },
});

function convertTime12To24(time: any): string {
    try {
        var hours = Number(time.match(/^(\d+)/)[1]);
        var minutes = Number(time.match(/:(\d+)/)[1]);
        var AMPM = time.match(/\s(.*)$/)[1];
        if (AMPM === "PM" && hours < 12) hours = hours + 12;
        if (AMPM === "AM" && hours === 12) hours = hours - 12;
        var sHours = hours.toString();
        var sMinutes = minutes.toString();
        if (hours < 10) sHours = "0" + sHours;
        if (minutes < 10) sMinutes = "0" + sMinutes;
        return sHours + sMinutes;
    } catch (error) {
        throw error;
    }
}

function insert(main_string: string, ins_string: string, pos: number) {
    if (typeof pos == "undefined") {
        pos = 0;
    }
    if (typeof ins_string == "undefined") {
        ins_string = "";
    }
    return main_string.slice(0, pos) + ins_string + main_string.slice(pos);
}

function getProxy(rawTime: string): string {
    //1030P
    //650A
    //430P

    let digitsStr = rawTime.slice(0, -1);
    let letter = rawTime.slice(-1) + "M";

    if (digitsStr.length === 3) {
        digitsStr = insert(digitsStr, ":", 1);
    } else if (digitsStr.length === 4) {
        digitsStr = insert(digitsStr, ":", 2);
    } else {
        throw new Error("Invalid Time Format");
    }

    return `${digitsStr} ${letter}`;
}

function getLastChar(str: string) {
    return str.charAt(str.length - 1);
}

function hasNumber(myString: string) {
    return /\d/.test(myString);
}

function processTokens(tokens: string[]): any {
    return tokens.map((token) => {
        if (
            (token.length === 5 || token.length === 4) &&
            (getLastChar(token) === "A" || getLastChar(token) === "P") &&
            hasNumber(token)
        ) {
            console.log(token);
            let proxyTime: string;
            let trueTime: string;
            try {
                proxyTime = getProxy(token);
                trueTime = convertTime12To24(proxyTime);

                return trueTime;
            } catch (error) {
                throw error;
            }
        } else {
            return token;
        }
    });
}

function App() {
    const [code, setCode] = useState("");
    const [result, setResult] = useState("");
    const [processError, setProcessError] = useState("");
    const [loading, setLoading] = useState(false);

    const generateLinkHandler = () => {
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
                if (!res.ok) throw new Error("Error happened man!!!");
                return res.json();
            })
            .then((offerData) => {
                setResult(offerToText(offerData));
            })
            .catch((err) => {
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
            } catch (error) {}
        });

        return trueLines.join("\n");
    };

    const convertHandler = () => {
        const resultCode = convert();

        setResult(resultCode);
    };

    const copyHandler = () => {
        navigator.clipboard.writeText(result);
    };

    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <div className="App">
                <Container maxWidth="lg">
                    <Typography variant="h3" gutterBottom>
                        U.S. PRN Time to EUR PRN time
                    </Typography>

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

                    <Grid
                        container
                        spacing={2}
                        sx={{ flexDirection: "column" }}
                    >
                        <Grid item>
                            <TextField
                                fullWidth={true}
                                id="outlined-basic"
                                label="PRN Code"
                                variant="outlined"
                                placeholder="Enter your prn code here."
                                multiline={true}
                                rows={6}
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                            />
                        </Grid>
                        <Grid item sx={{ mb: 12 }}>
                            <Button
                                sx={{ mr: 2 }}
                                onClick={convertHandler}
                                variant="outlined"
                            >
                                <CachedIcon sx={{ mr: 1 }} />
                                Convert
                            </Button>
                            <LoadingButton
                                onClick={generateLinkHandler}
                                variant="outlined"
                                loading={loading}
                                loadingPosition="start"
                                startIcon={<TextSnippetIcon sx={{ mr: 1 }} />}
                            >
                                Convert & Get Text
                            </LoadingButton>
                        </Grid>
                        <Grid item>
                            <Typography variant="h3" gutterBottom>
                                Results
                            </Typography>
                            <TextField
                                fullWidth
                                id="outlined-basic"
                                variant="outlined"
                                multiline={true}
                                rows={6}
                                value={result}
                                disabled
                            />
                            <Button
                                sx={{ mt: 4 }}
                                variant="outlined"
                                onClick={copyHandler}
                            >
                                Copy
                            </Button>
                        </Grid>
                    </Grid>
                </Container>
            </div>
        </ThemeProvider>
    );
}

export default App;
