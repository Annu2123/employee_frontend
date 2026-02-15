import httpClient from "../api/httpclient";
import { User } from "../types";
import { Owner } from "../types"
export const getAllUsers = async (): Promise<User[]> => {
    const response = await httpClient.get('/users');
    return response.data;
}

export const getOwners = async (): Promise<Owner[]> => {
    const response = await httpClient.get("/super_admin/owners")
    return response.data
}
