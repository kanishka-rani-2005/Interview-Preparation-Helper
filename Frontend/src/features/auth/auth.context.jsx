import { createContext,useState } from "react";

export const AuthContext = createContext() //global container where authentication data will be stored.


export const AuthProvider = ({ children }) => { 

    const [user, setUser] = useState(null) //no one is logged in.
    const [loading, setLoading] = useState(true) // wait until the session check finishes


    return (
        <AuthContext.Provider value={{user,setUser,loading,setLoading}} >
            {children}
        </AuthContext.Provider>
    )
    
}