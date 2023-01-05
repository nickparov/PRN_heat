import { LoadingButton } from "@mui/lab";
import { Grid, Button, Stack, Box } from "@mui/material";
import CachedIcon from "@mui/icons-material/Cached";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import SwitchLabels from "./Switch";

interface Props {
    generateHumanTextHandler: () => void;
    convertHandler: () => void;
    isLoading: boolean;
    codeValue: string;
}

const Controls = (props: Props) => {
    const { codeValue, isLoading, generateHumanTextHandler, convertHandler } =
        props;

    return (
        <>
            <Stack direction={"row"} mt={"12px"} justifyContent={"space-between"} spacing={3}>
                <SwitchLabels />

                <Box pt={"8px"}>
                    <Button
                        sx={{ mr: 2, height: "55px" }}
                        onClick={convertHandler}
                        variant="outlined"
                        size="large"
                        disabled={codeValue.length === 0}
                    >
                        <CachedIcon sx={{ mr: 1 }} />
                        Convert
                    </Button>
                    <LoadingButton
                        onClick={generateHumanTextHandler}
                        variant="outlined"
                        loading={isLoading}
                        loadingPosition="start"
                        startIcon={<TextSnippetIcon sx={{ mr: 1 }} />}
                        size="large"
                        disabled={codeValue.length === 0}
                        sx={{height: "55px"}}
                    >
                        Get Human Text
                    </LoadingButton>
                </Box>
            </Stack>
        </>
    );
};

export { Controls };
