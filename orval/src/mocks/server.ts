import { setupServer } from "msw/node";
import { getGetPetsMockHandler } from "../api/petstore";

const getPetsHandler = getGetPetsMockHandler();

export const server = setupServer(getPetsHandler);
