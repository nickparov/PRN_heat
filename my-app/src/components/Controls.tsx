import { LoadingButton } from "@mui/lab";
import { Grid, Button, Stack, Box } from "@mui/material";
import CachedIcon from "@mui/icons-material/Cached";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import SwitchLabels from "./Switch";
import { useContext } from "react";
import { AppDispatchContext, AppStateContext } from "../App";
import { appDispatchFunc, appStateInterface } from "../reducers/app";
import {
    doAppendHistory,
    doGetHumanTextUserCode,
    doOpenSnackbar,
    doSetLoading,
    doSetResult,
} from "../actions/App/actionCreators";
import { processTokens } from "../utils/parser";
import { offerToText } from "../utils/magic";

interface Props {
    setProcessError: React.Dispatch<React.SetStateAction<string>>;
}

const Controls = (props: Props) => {
    const dispatch = useContext(AppDispatchContext) as appDispatchFunc;
    const { code, loading, price, luggage } = useContext(
        AppStateContext
    ) as appStateInterface;

    const { setProcessError } = props;

    const appendOptions = (resCode: string): string => {
        const appendTxt = `\nЦена: ${price}$ | Багаж ${
            luggage ? "" : "не "
        }включен`;
        return resCode.concat(appendTxt);
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
                // add better error handling (maybe snackbar?)
                console.error(error);
            }
        });

        return trueLines.join("\n");
    };

    const generateHumanTextHandler = () => {
        const convertedCode = convert();
        const queryCode = convertedCode.split("\n").join(" ");

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

                const offerHumanText = appendOptions(
                    offerToText(offerData.offer)
                );

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
        if (code.length === 0) return;

        const resultCode = convert();

        dispatch(doOpenSnackbar("Conversion done."));
        dispatch(doAppendHistory(resultCode));
        dispatch(doSetResult(resultCode));
    };

    return (
        <Stack
            direction={"row"}
            mt={"12px"}
            justifyContent={"space-between"}
            spacing={3}
        >
            <SwitchLabels />

            <Box pt={"8px"}>
                <Button
                    sx={{ mr: 2, height: "55px" }}
                    onClick={convertHandler}
                    variant="outlined"
                    size="large"
                    disabled={code.length === 0}
                >
                    <CachedIcon sx={{ mr: 1 }} />
                    Convert
                </Button>
                <LoadingButton
                    onClick={generateHumanTextHandler}
                    variant="outlined"
                    loading={loading}
                    loadingPosition="start"
                    startIcon={<TextSnippetIcon sx={{ mr: 1 }} />}
                    size="large"
                    disabled={code.length === 0}
                    sx={{ height: "55px" }}
                >
                    Get Human Text
                </LoadingButton>
            </Box>
        </Stack>
    );
};

export { Controls };
