
import { formatDatetime, formatTime } from "./date";

import { messages } from "./msgs";

function formatWithDate(dateStr) {
    return formatDatetime(dateStr);
}

function formatWithoutDate(dateStr) {
    return formatTime(dateStr);
}

function segmentDates(segment) {
    const departureDate = new Date(segment.departure.timestamp);
    const arrivalDate = new Date(segment.arrival.timestamp);
    const departureDateText = formatWithDate(segment.departure.timestamp);
    const isMoreThan1day = arrivalDate - departureDate > 24 * 60 * 60 * 1000;
    const arrivalDateText = isMoreThan1day
        ? formatWithDate(segment.arrival.timestamp)
        : formatWithoutDate(segment.arrival.timestamp);
    return `${departureDateText} – ${arrivalDateText}`;
}

function airportToText(airport) {
    if (airport.city && airport.city !== airport.name) {
        return `${airport.city} (${airport.name})`;
    }
    return airport.name || airport.code;
}

function airlineToText(airline) {
    return airline.name || airline.code;
}

function flightNo(segment) {
    return `${segment.airline.code} ${segment.number}`;
}

function segmentToText(segment) {
    return `${segmentDates(segment)}, ${airportToText(
        segment.departure.airport
    )} — ${airportToText(segment.arrival.airport)}, ${flightNo(
        segment
    )}, ${airlineToText(segment.airline)}`;
}

function optionToText(option) {
    const segments = [...option.toDestination, ...option.fromDestination];
    const result = segments.map(segmentToText).join("\n");
    const additionalText = [];
    if (option.price) {
        additionalText.push(
            messages.ru.translation.optionToTextPrice.replace("{number}", option.price)
        );
    }
    if (option.luggage !== null) {
        if (option.luggage) {
            additionalText.push(messages.ru.translation.offerTextWithLuggage);
        } else {
            additionalText.push(messages.ru.translation.offerTextWithoutLuggage);
        }
    }
    if (option.tags.length > 0) {
        additionalText.push(option.tags.map((tag) => tag.name).join(" | "));
    }
    return [result, additionalText.join(" | ")].join("\n");
}

export function offerToText(offer) {
    const text = offer.name + "\n\n";
    const { options } = offer;
    const optionsToText = [];

    console.log(offer);

    for (let i = 0; i < options.length; i++) {
        let optionText = "";
        const option = options[i];
        if (options.length > 1) {
            optionText +=
                messages.ru.translation.optionHelp.replace("{number}", i + 1) + "\n";
        }
        optionText += optionToText(option);
        optionsToText.push(optionText);
    }
    return text + optionsToText.join("\n\n");
}
