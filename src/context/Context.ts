import { createContext } from "react";
import { IUserContext } from "../types/context";

export const UserContext = createContext<IUserContext>({});
