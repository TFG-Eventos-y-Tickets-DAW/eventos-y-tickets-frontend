export interface LoginResponse {
    accessToken?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    userId?: number;
}

export interface ErrorResponse {
    error_type?: string;
    error_detail?: string;
}
