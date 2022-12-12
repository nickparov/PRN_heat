import { Button, Grid, Typography } from "@mui/material";
import { SingleHistory } from "./SingleHistory";

interface Props {
    history: string[];
    clearHandler: () => void;
}

const History = (props: Props) => {
    const { history, clearHandler } = props;

    if (history.length === 0) {
        return null;
    }

    return (
        <Grid sx={{ mt: 12 }} item>
            <Typography sx={{ mt: 4 }} variant="h4">
                History
            </Typography>
            <Typography variant="caption">Click to copy.</Typography>
            <Grid container sx={{ mt: 1 }} spacing={2}>
                {history.map((snapshot, idx) => (
                    <SingleHistory content={snapshot} key={idx} />
                ))}
            </Grid>
            <Button
                onClick={clearHandler}
                sx={{ mt: 2 }}
                variant="outlined"
                size={"large"}
            >
                Clear
            </Button>
        </Grid>
    );
};

export { History };
