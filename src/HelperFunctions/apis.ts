import { LoginResponse, ErrorResponse, ISignInResponse } from "../types/apis";

export async function login(credentials: { email: string; password: string }) {
    const response = await fetch(
        "https://1he0dulvh9.execute-api.us-east-1.amazonaws.com/api/v1/user/signin",
        {
            method: "POST",
            body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
            }),
        }
    );

    const responseJson: LoginResponse & ErrorResponse = await response.json();

    return responseJson;
}

export async function signUp(newUserData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}) {
    const response = await fetch(
        "https://1he0dulvh9.execute-api.us-east-1.amazonaws.com/api/v1/user/signup",
        {
            method: "POST",
            body: JSON.stringify({
                firstName: newUserData.firstName,
                lastName: newUserData.lastName,
                email: newUserData.email,
                password: newUserData.password,
                isAnonymous: false,
            }),
        }
    );

    const responseJson: ISignInResponse & ErrorResponse = await response.json();

    return responseJson;
}
