export function convertTime12To24(time: any): string {
    try {
        var hours = Number(time.match(/^(\d+)/)[1]);
        var minutes = Number(time.match(/:(\d+)/)[1]);
        var AMPM = time.match(/\s(.*)$/)[1];
        if (AMPM === "PM" && hours < 12) hours = hours + 12;
        if (AMPM === "AM" && hours === 12) hours = hours - 12;
        var sHours = hours.toString();
        var sMinutes = minutes.toString();
        if (hours < 10) sHours = "0" + sHours;
        if (minutes < 10) sMinutes = "0" + sMinutes;
        return sHours + sMinutes;
    } catch (error) {
        throw error;
    }
}

export function insert(main_string: string, ins_string: string, pos: number) {
    if (typeof pos == "undefined") {
        pos = 0;
    }
    if (typeof ins_string == "undefined") {
        ins_string = "";
    }
    return main_string.slice(0, pos) + ins_string + main_string.slice(pos);
}

export function getProxy(rawTime: string): string {
    //1030P
    //650A
    //430P

    let digitsStr = rawTime.slice(0, -1);
    let letter = rawTime.slice(-1) + "M";

    if (digitsStr.length === 3) {
        digitsStr = insert(digitsStr, ":", 1);
    } else if (digitsStr.length === 4) {
        digitsStr = insert(digitsStr, ":", 2);
    } else {
        throw new Error(`Invalid Time Format: ${rawTime}`);
    }

    return `${digitsStr} ${letter}`;
}

export function getLastChar(str: string) {
    return str.charAt(str.length - 1);
}

export function hasNumber(myString: string) {
    return /\d/.test(myString);
}

export function checkJoinedTimeLetters(str: string) {
    if ((str.includes("A") || str.includes("P")) && hasNumber(str)) {
        let Ps = 0;
        let As = 0;
        let allOtherLetters = 0;

        // count As and Ps
        str.split("").forEach((letter) => {
            if (letter === "A") {
                As++;
            } else if (letter === "P") {
                Ps++;
            } else if (!hasNumber(letter)) {
                allOtherLetters++;
            }
        });

        const total = Ps + As;
        if (total === 2 && allOtherLetters === 0) {
            return true;
        }
    }

    return false;
}

export function US_CDG_timeToken(token: string) {
    return (
        (token.length === 5 || token.length === 4) &&
        (getLastChar(token) === "A" || getLastChar(token) === "P") &&
        hasNumber(token)
    );
}

export function getTrueTimeFromCDGToken(token: string) {
    let proxyTime: string;
    let trueTime: string;

    try {
        console.log("getTrueTimeFromCDGToken", token)
        proxyTime = getProxy(token);
        trueTime = convertTime12To24(proxyTime);

        return trueTime;
    } catch (error) {
        throw error;
    }
}

export function charIndexes(substring: string, string: string) {
    var a = [],
        i = -1;
    while ((i = string.indexOf(substring, i + 1)) >= 0) a.push(i);
    return a;
}

export function processTokens(tokens: string[]): string[] {
    return tokens.map((token) => {
        if (token.length >= 6 && checkJoinedTimeLetters(token) && US_CDG_timeToken(token)) {
            let indexOfP = token.indexOf("P");
            let indexOfA = token.indexOf("A");
            let targetLetter = null;
            let idxAr = [];

            if (indexOfP === -1) {
                // all As
                targetLetter = "A";
            } else if (indexOfA === -1) {
                // all Ps
                targetLetter = "P";
            }

            if (targetLetter) {
                idxAr = [...charIndexes(targetLetter, token)];
            } else {
                idxAr = [indexOfA, indexOfP];
            }

            const [fIndex, sIndex] = idxAr;

            const timeIndexes = [
                Math.min(fIndex, sIndex) + 1,
                Math.max(fIndex, sIndex),
            ];

            const parsedTimes = [
                token.substring(0, timeIndexes[0]),
                token.substring(timeIndexes[0]),
            ];


            const trueTimes = parsedTimes.map(getTrueTimeFromCDGToken);

            return trueTimes.join("");
        }

        const includesPlus = token.includes("+");
        const includesMinus = token.includes("-");

        if (includesPlus || includesMinus) {
            const parsedTokenArr =
                includesPlus === true ? token.split("+") : token.split("-");

            if (
                US_CDG_timeToken(parsedTokenArr[0]) &&
                hasNumber(parsedTokenArr[1])
            ) {
                return `${getTrueTimeFromCDGToken(parsedTokenArr[0])}${includesPlus ? "+" : "-"
                    }${parsedTokenArr[1]}`;
            }
        }

        if (US_CDG_timeToken(token)) {
            // 825A+1
            return getTrueTimeFromCDGToken(token);
        }

        if (token.includes("CDG")) {
            return "CDG";
        }

        return token;
    });
}