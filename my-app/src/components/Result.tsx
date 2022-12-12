import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { Grid, Typography, TextField, Button } from "@mui/material";

interface Props {
    setResult: React.Dispatch<React.SetStateAction<string>>;
    copyHandler: () => void;
    result: string;
}

const Result = (props: Props) => {
    const { setResult, result, copyHandler } = props;

    return (
        <Grid item>
            <Typography variant="h3" gutterBottom>
                Result
            </Typography>
            <TextField
                fullWidth
                id="outlined-basic"
                variant="outlined"
                multiline={true}
                rows={9}
                value={result}
                onChange={(e) => setResult(e.target.value)}
            />
            <Button
                sx={{ mt: 2 }}
                variant="outlined"
                onClick={copyHandler}
                fullWidth
                size="large"
                disabled={result.length === 0}
            >
                <ContentCopyIcon sx={{ mr: 1 }} />
                Copy
            </Button>
        </Grid>
    );
};

export { Result };
