import React, { useEffect, useState } from "react";
import type { Pet } from "./api/petstore";

const PetStore: React.FC = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const listPets = async (limit: number) => {
      const response = await fetch(`/api/petstore?limit=${limit}`);
      if (response.ok) {
        const data = await response.json();
        setPets(data);
      }
      setLoading(false);
    };

    listPets(25);
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Petstore</h2>
      <ul>
        {pets.map((pet) => (
          <li key={pet.id}>{pet.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default PetStore;
