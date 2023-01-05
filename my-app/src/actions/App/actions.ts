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
    // keep only 6 newest records.
    // check his >= 7.
    if (state.history.length === 6) {
        const updatedHis = [...state.history.slice(1), action.payload.value];

        return {
            ...state,
            history: updatedHis
        }
    }

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

export const setLuggage = (state: appStateInterface, action: appAction) => {
    return {
        ...state,
        luggage: action.payload.value,
    };
};
export const setPrice = (state: appStateInterface, action: appAction) => {
    return {
        ...state,
        price: action.payload.value,
    };
};

export const reset = (state: appStateInterface, action: appAction) => {
    return {
        ...state,
        code: "",
        result: "",
        luggage: false,
        price: 0,
    };
};
