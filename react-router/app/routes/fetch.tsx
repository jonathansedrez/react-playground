import { useLoaderData, useRevalidator } from "react-router";
import type { Route } from "./+types/fetch";

type User = {
  name: string;
  email: string;
  company: {
    name: string;
  };
};

export async function clientLoader() {
  const userId = Math.floor(Math.random() * 10) + 1;
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/users/${userId}`,
  );
  const user: User = await response.json();
  return { user };
}

export default function Fetch({ loaderData }: Route.ComponentProps) {
  const revalidator = useRevalidator();
  const { user } = useLoaderData<typeof clientLoader>();

  return (
    <div>
      <h2>Fetched User Data</h2>
      <p>
        <strong>Name (from prop):</strong> {loaderData.user.name}
      </p>
      <p>
        <strong>Email (from prop):</strong> {loaderData.user.email}
      </p>
      <p>
        <strong>Company (from hook):</strong> {user.company.name}
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
