import {
    Card,
    CardActionArea,
    CardContent,
    Grid,
    Typography,
} from "@mui/material";

interface Props {
    content: string;
}

const SingleHistory = (props: Props) => {
    const { content } = props;

    const cardClickHandler = () => {
        navigator.clipboard.writeText(content);
    };

    return (
        <Grid item xs={4}>
            <Card sx={{ maxWidth: 345 }}>
                <CardActionArea onClick={cardClickHandler}>
                    <CardContent>
                        <Typography variant="caption" color="text.secondary">
                            {content}
                        </Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
        </Grid>
    );
};


export { SingleHistory };
