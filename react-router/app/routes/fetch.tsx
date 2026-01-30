import type { Route } from "./+types/fetch";

export async function clientLoader() {
  const response = await fetch("https://jsonplaceholder.typicode.com/users/1");
  const user = await response.json();
  return { user };
}

export default function Fetch({ loaderData }: Route.ComponentProps) {
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
    </div>
  );
}
