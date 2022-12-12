import { LoadingButton } from "@mui/lab";
import { Grid, TextField, Button } from "@mui/material";
import CachedIcon from "@mui/icons-material/Cached";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";

interface Props {
    codeChangeHandler: React.Dispatch<React.SetStateAction<string>>;
    generateHumanTextHandler: () => void;
    convertHandler: () => void;
    isLoading: boolean;
    codeValue: string;
}

const Controls = (props: Props) => {
    const {
        codeValue,
        isLoading,
        codeChangeHandler,
        generateHumanTextHandler,
        convertHandler,
    } = props;

    return (
        <>
            <Grid item>
                <TextField
                    fullWidth={true}
                    id="outlined-basic"
                    label="PRN Code"
                    variant="outlined"
                    placeholder="Enter your prn code here."
                    multiline={true}
                    rows={6}
                    value={codeValue}
                    onChange={(e) => codeChangeHandler(e.target.value)}
                />
            </Grid>
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
