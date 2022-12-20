import * as actions from "../actions/App/actions";

export interface appStateInterface {
    code: string;
    result: string;
    history: string[];
    loading: boolean;
    snackbar: {
        open: boolean;
        vertical: verticalType;
        horizontal: horizontalType;
        msg: string;
    };
}

export interface appAction {
    payload: anyObject;
    type: appActionType;
}

type anyObject = {
    [key: string]: any;
};

type horizontalType = "center" | "left" | "right";
type verticalType = "bottom" | "top";

export type appActionType =
    | "open_snackbar"
    | "close_snackbar"
    | "append_history"
    | "clear_history"
    | "set_history"
    | "set_loading"
    | "get_humantext_usercode"
    | "set_usercode"
    | "set_result"
    | "set_loading";

export enum appActions {
    OPEN_SNACKBAR = "open_snackbar",
    CLOSE_SNACKBAR = "close_snackbar",
    APPEND_HISTORY = "append_history",
    CLEAR_HISTORY = "clear_history",
    SET_HISTORY = "set_history",
    GET_HUMANTEXT_USERCODE = "get_humantext_usercode",
    SET_USERCODE = "set_usercode",
    SET_RESULT = "set_result",
    SET_LOADING = "set_loading",
}

// Reducer
const appReducer = (
    state: appStateInterface,
    action: appAction
): appStateInterface => {
    switch (action.type) {
        case "open_snackbar":
            return actions.openSnackbar(state, action);
        case "close_snackbar":
            return actions.closeSnackbar(state, action);
        case "append_history":
            return actions.appendHistory(state, action);
        case "clear_history":
            return actions.clearHistory(state, action);
        case "set_history":
            return actions.setHistory(state, action);
        case "set_loading":
            return actions.setLoading(state, action);
        case "get_humantext_usercode":
            return actions.getHumantextUsercode(state, action);
        case "set_usercode":
            return actions.setUsercode(state, action);
        case "set_result":
            return actions.setResult(state, action);
        default:
            return state;
    }
};

const initialState: appStateInterface = {
    code: "",
    result: "",
    history: [],
    loading: false,
    snackbar: {
        open: false,
        vertical: "top",
        horizontal: "right",
        msg: "",
    },
};

export { initialState };
export default appReducer;
