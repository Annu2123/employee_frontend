import httpClient from "../api/httpclient";
import { User } from "../types";

export const getAllUsers = async (): Promise<User[]> => {
    const response = await httpClient.get('/users');
    return response.data;
}
