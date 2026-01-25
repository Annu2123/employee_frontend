import { useMutation } from '@tanstack/react-query'
import { login } from '../services/auth'
import { LoginCredetial } from '../types'
export const useAuthLogin = () => {
    return useMutation({
        mutationFn: (data: LoginCredetial) => login(data),
        onSuccess: (data) => {
            localStorage.setItem('token', data.token)
            console.log("loginsuccess")
        },
        onError: (error) => {
            console.log("error failed", error)
        }
    })
}   