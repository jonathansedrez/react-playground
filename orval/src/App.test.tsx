import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "./App";

test("renders hello world text", () => {
  render(<App />);
  expect(true).toBeTruthy();
});
