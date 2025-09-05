import { render, waitFor } from "@testing-library/react";
import PetsList from "./PetStore";

test("renders pets from Orval MSW mock", async () => {
  const { debug } = render(<PetsList />);

  await waitFor(() => {
    debug();
  });
});
