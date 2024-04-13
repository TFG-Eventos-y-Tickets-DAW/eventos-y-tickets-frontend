import { LoginResponse, ErrorResponse } from "../types/apis";

export default async function login(credentials: {
    email: string;
    password: string;
}) {
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
