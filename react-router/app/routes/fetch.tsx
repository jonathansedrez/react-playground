import { Suspense } from "react";
import { Await, useLoaderData, useRevalidator } from "react-router";
import type { Route } from "./+types/fetch";

type User = {
  name: string;
  email: string;
  company: {
    name: string;
  };
  address: {
    geo: {
      lat: string;
      lng: string;
    };
  };
};

type Location = {
  display_name: string;
};

const REAL_COORDINATES: Record<number, { lat: string; lng: string }> = {
  1: { lat: "40.7128", lng: "-74.0060" }, // New York
  2: { lat: "34.0522", lng: "-118.2437" }, // Los Angeles
  3: { lat: "51.5074", lng: "-0.1278" }, // London
  4: { lat: "48.8566", lng: "2.3522" }, // Paris
  5: { lat: "35.6762", lng: "139.6503" }, // Tokyo
  6: { lat: "-23.5505", lng: "-46.6333" }, // São Paulo
  7: { lat: "55.7558", lng: "37.6173" }, // Moscow
  8: { lat: "39.9042", lng: "116.4074" }, // Beijing
  9: { lat: "-33.8688", lng: "151.2093" }, // Sydney
  10: { lat: "19.4326", lng: "-99.1332" }, // Mexico City
};

async function fetchLocation(lat: string, lng: string): Promise<Location> {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
  );
  const data = await response.json();

  return data;
}

export async function clientLoader() {
  const userId = Math.floor(Math.random() * 10) + 1;
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/users/${userId}`,
  );
  const user: User = await response.json();

  // Use real coordinates instead of JSONPlaceholder's fake ones
  const coords = REAL_COORDINATES[userId];

  const locationPromise = fetchLocation(coords.lat, coords.lng);

  return {
    user,
    location: locationPromise,
  };
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

      <Suspense fallback={<p>Loading location...</p>}>
        <Await resolve={loaderData.location}>
          {(location: Location) => (
            <p>
              <strong>Location (deferred):</strong> {location.display_name}
            </p>
          )}
        </Await>
      </Suspense>

      <button
        onClick={() => revalidator.revalidate()}
        disabled={revalidator.state === "loading"}
      >
        {revalidator.state === "loading" ? "Refetching..." : "Refetch Data"}
      </button>
    </div>
  );
}
