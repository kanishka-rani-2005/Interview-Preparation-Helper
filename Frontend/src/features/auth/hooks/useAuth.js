import { useContext, useEffect } from "react";
import { AuthContext } from "../auth.context";
import { login, register, logout, getMe } from "../services/auth.api";



export const useAuth = () => {
    const context = useContext(AuthContext)
    const { user, setUser, loading, setLoading } = context

    const handleLogin = async ({ email, password }) => {
        try {
            const data = await login({ email, password })
            const loggedInUser = data?.user ?? null
            setUser(loggedInUser)
            return loggedInUser
        } catch (err) {
            console.log(err)
            return null
        }
    }

    const handleRegister = async ({ username, email, password }) => {
        try {
            const data = await register({ username, email, password })
            const registeredUser = data?.user ?? null
            setUser(registeredUser)
            return registeredUser
        } catch (err) {
            console.log(err)
            return null
        }
    }

    const handleLogout = async () => {
        try {
            await logout()
            setUser(null)
            return true
        } catch (err) {
            console.log(err)
            return false
        }
    }

    return { user, loading, handleRegister, handleLogin, handleLogout }
}