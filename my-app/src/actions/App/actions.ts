import { appAction, appStateInterface } from "../../reducers/app";

export const openSnackbar = (state: appStateInterface, action: appAction) => {
    return {
        ...state,
        snackbar: {
            ...state.snackbar,
            open: true,
            msg: action.payload.msg,
        },
    };
};

export const closeSnackbar = (state: appStateInterface, action: appAction) => {
    return {
        ...state,
        snackbar: {
            ...state.snackbar,
            open: false,
            msg: "",
        },
    };
};

export const appendHistory = (state: appStateInterface, action: appAction) => {
    return {
        ...state,
        history: [...state.history, action.payload.value],
    };
};

export const clearHistory = (state: appStateInterface, action: appAction) => {
    return {
        ...state,
        history: [],
    };
};

export const setHistory = (state: appStateInterface, action: appAction) => {
    return {
        ...state,
        history: action.payload.value,
    };
};

export const setLoading = (state: appStateInterface, action: appAction) => {
    return {
        ...state,
        loading: action.payload.loading,
    };
};

export const getHumantextUsercode = (state: appStateInterface, action: appAction) => {
    return {
        ...state,
        loading: false,
    };
};

export const setUsercode = (state: appStateInterface, action: appAction) => {
    return {
        ...state,
        code: action.payload.value,
    };
};

export const setResult = (state: appStateInterface, action: appAction) => {
    return {
        ...state,
        result: action.payload.value,
    };
};
