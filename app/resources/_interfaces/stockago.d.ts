export interface StockagoResponse {
    code: number,
    status: boolean,
    msg: string
}

export interface StockagoCredentials {
    auth_token: string,
    auth_user: string
}