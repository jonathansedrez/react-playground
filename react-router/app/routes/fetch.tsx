import { useRevalidator } from "react-router";
import type { Route } from "./+types/fetch";

export async function clientLoader() {
  const userId = Math.floor(Math.random() * 10) + 1;
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/users/${userId}`,
  );
  const user = await response.json();
  return { user };
}

export default function Fetch({ loaderData }: Route.ComponentProps) {
  const revalidator = useRevalidator();

  return (
    <div>
      <h2>Fetched User Data</h2>
      <p>
        <strong>Name:</strong> {loaderData.user.name}
      </p>
      <p>
        <strong>Email:</strong> {loaderData.user.email}
      </p>
      <p>
        <strong>Company:</strong> {loaderData.user.company.name}
      </p>
      <button
        onClick={() => revalidator.revalidate()}
        disabled={revalidator.state === "loading"}
      >
        {revalidator.state === "loading" ? "Refetching..." : "Refetch Data"}
      </button>
    </div>
  );
}
