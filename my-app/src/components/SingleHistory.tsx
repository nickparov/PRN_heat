import {
    Card,
    CardActionArea,
    CardContent,
    Grid,
    Typography,
} from "@mui/material";
import { useContext } from "react";
import { doOpenSnackbar } from "../actions/App/actionCreators";
import { AppDispatchContext } from "../App";
import { appDispatchFunc } from "../reducers/app";

interface Props {
    content: string;
}

const SingleHistory = (props: Props) => {
    const dispatch = useContext(AppDispatchContext) as appDispatchFunc;

    const { content } = props;

    const cardClickHandler = () => {
        navigator.clipboard.writeText(content);
        dispatch(doOpenSnackbar("History copied!"));
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
