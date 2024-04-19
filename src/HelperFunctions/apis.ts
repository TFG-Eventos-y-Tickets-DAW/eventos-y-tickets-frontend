import { LoginResponse, ErrorResponse, ISignInResponse } from "../types/apis";

export const serverUrl: string = "https://api.eventngreet.com/";

export async function fetchPublicEvents(
    itemsPerPage: number = 0,
    paginationToken: string = ""
) {
    const bodyParameters =
        itemsPerPage === 0
            ? {
                  filters: {
                      status: "PUBLISHED",
                  },
                  paginationToken: paginationToken,
              }
            : {
                  filters: {
                      status: "PUBLISHED",
                  },
                  itemsPerPage: itemsPerPage,
              };

    const events = await fetch(`${serverUrl}/api/v1/events`, {
        method: "POST",
        body: JSON.stringify(bodyParameters),
    }).then((response) => {
        return response.json();
    });

    return events;
}

export async function login(credentials: { email: string; password: string }) {
    const response = await fetch(`${serverUrl}/api/v1/user/signin`, {
        method: "POST",
        body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
        }),
    });

    const responseJson: LoginResponse & ErrorResponse = await response.json();

    return responseJson;
}

export async function signUp(newUserData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}) {
    const response = await fetch(`${serverUrl}/api/v1/user/signup`, {
        method: "POST",
        body: JSON.stringify({
            firstName: newUserData.firstName,
            lastName: newUserData.lastName,
            email: newUserData.email,
            password: newUserData.password,
            isAnonymous: false,
        }),
    });

    const responseJson: ISignInResponse & ErrorResponse = await response.json();

    return responseJson;
}
