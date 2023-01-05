import { appAction } from "../../reducers/app";

export function doAppendHistory(value: string): appAction {
    return {
        type: "append_history",
        payload: {
            value: value,
        },
    }
}

export function doSetResult(value: string): appAction {
    return {
        type: "set_result",
        payload: {
            value: value,
        }
    }
}

export function doOpenSnackbar(message: string): appAction {
    return {
        type: "open_snackbar",
        payload: {
            msg: message,
        },
    }
}

export function doSetLoading(loading: boolean): appAction {
    return {
        type: "set_loading",
        payload: { loading: loading },
    };
}

export function doSetHistory(localHistory: string[]): appAction {
    return {
        type: "set_history",
        payload: {
            value: localHistory,
        },
    }
}

export function doCloseSnackbar(): appAction {
    return {
        type: "close_snackbar",
        payload: {},
    };
}

export function doClearHistory(): appAction {
    return {
        type: "clear_history",
        payload: {},
    };
}

export function doGetHumanTextUserCode(): appAction {
    return {
        type: "get_humantext_usercode",
        payload: {},
    };
}

export function doSetUserCode(value: string): appAction {
    return {
        type: "set_usercode",
        payload: { value: value },
    }
}

export function doSetLuggage(value: boolean): appAction {
    return {
        type: "set_luggage",
        payload: { value: value },
    }
}


export function doSetPrice(value: number): appAction {
    return {
        type: "set_price",
        payload: { value: value }
    }
}
export function doReset(): appAction {
    return {
        type: "reset",
        payload: {}
    }
}