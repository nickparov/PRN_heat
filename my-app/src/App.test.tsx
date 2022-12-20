import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";

import App from "./App";

it("should render the component and perform actions", async () => {
    // render the component
    render(<App />);

    // enter some input text into the textarea
    const textarea = screen.getByTestId("textarea");
    const result = screen.getByTestId("resultarea");

    // put in New Content into that area
    fireEvent.change(textarea, {
        target: { value: "New Content" },
    });

    // click the "Convert" button
    const convertButton = screen.getByText("Convert");
    fireEvent.click(convertButton);

    expect(result.textContent).toBe("New Content");

    // fireEvent.change(textarea, {
    //     target: { value: "New Content 2" },
    // });

    // // click the "Convert" button
    // const generateTextButton = screen.getByText("Get Human Text");
    // fireEvent.click(generateTextButton);

    // // check that the result is displayed in the "result" element
    // expect(result.textContent).toBe("New Content 2");
});
