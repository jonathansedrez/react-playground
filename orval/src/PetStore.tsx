import React, { useEffect, useState } from "react";
import type { Pet } from "./api/petstore";
import { listPets } from "./api/petstore";

const PetStore: React.FC = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await listPets();
        setPets(response.data);
        console.log(response);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetch();
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
