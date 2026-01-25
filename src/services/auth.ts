import httpClient from '../api/httpclient'
import { AuthResponse, LoginCredetial } from '../types'



export const login = async (formdata: LoginCredetial): Promise<AuthResponse> => {
    console.log(formdata, "formdata")
    const data = await httpClient.post('/auth/user/login', formdata)
    return data.data
}