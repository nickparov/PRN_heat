import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Button, Container, Grid, TextField, Typography } from "@mui/material";

const darkTheme = createTheme({
    palette: {
        mode: "dark",
    },
});

function convertTime12To24(time: any): string {
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
            const proxyTime = getProxy(token);
            const trueTime = convertTime12To24(proxyTime);
            return trueTime;
        } else {
            return token;
        }
    });
}

function App() {
    const [code, setCode] = useState("");
    const [result, setResult] = useState("");

    const convertHandler = () => {
        const trueLines: string[] = [];
        // _ or __: AM/PM
        const lines = code.split("\n").map((el) => {
            return el;
        });
        // console.log(convertTime12To24("3:44 AM"));
        lines.forEach((line) => {
            trueLines.push(processTokens(line.split(" ")).join(" "));
        });

        const resultCode = trueLines.join("\n");
        setResult(resultCode);
    };

    const copyHandler = () => {
      navigator.clipboard.writeText(result);
    };

    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <div className="App">
                <Container maxWidth="xl">
                    <Typography variant="h3" gutterBottom>
                        U.S. PRN Time to EUR PRN time
                    </Typography>
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
                            <Button onClick={convertHandler} variant="outlined">
                                Convert
                            </Button>
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
