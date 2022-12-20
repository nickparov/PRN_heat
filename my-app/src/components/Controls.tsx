import { LoadingButton } from "@mui/lab";
import { Grid, Button } from "@mui/material";
import CachedIcon from "@mui/icons-material/Cached";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";

interface Props {
    generateHumanTextHandler: () => void;
    convertHandler: () => void;
    isLoading: boolean;
    codeValue: string;
}

const Controls = (props: Props) => {
    const {
        codeValue,
        isLoading,
        generateHumanTextHandler,
        convertHandler,
    } = props;

    return (
        <>
            <Grid item sx={{ mb: 6 }}>
                <Button
                    sx={{ mr: 2 }}
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
                >
                    Get Human Text
                </LoadingButton>
            </Grid>
        </>
    );
};

export { Controls };
