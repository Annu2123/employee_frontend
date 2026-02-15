import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
const httpClient: AxiosInstance = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json'
    }
})

//request interceptor automatice add token to each rewquest

httpClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = token
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

//global error handling
httpClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            console.log("Unauthorized")
        }
        return Promise.reject(error)
    }
)
export default httpClient