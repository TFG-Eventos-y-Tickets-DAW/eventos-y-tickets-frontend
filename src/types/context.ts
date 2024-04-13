import { Dispatch, SetStateAction } from "react";

export interface IUserInfo {
    firstName: string | undefined;
    lastName: string | undefined;
    email: string | undefined;
    userId: number | undefined;
}

export interface IUserContext {
    isLoggedIn?: boolean;
    currentUser?: IUserInfo;
    setIsLoggedIn?: Dispatch<SetStateAction<boolean | undefined>>;
    setCurrentUser?: Dispatch<SetStateAction<IUserInfo | undefined>>;
}
