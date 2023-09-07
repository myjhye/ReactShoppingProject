import { createContext, useContext, useEffect, useState } from "react";
import { onUserStateChange } from "../api/firebase";
import { login, logout } from '../api/firebase';

const authContext = createContext();

export function AuthContextProvider({ children }) {

    const [user, setUser] = useState(); 
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        onUserStateChange((user) => {
            console.log(user);
            setUser(user);
        });
    }, [])

    const authContextValue = {
        user: user,
        login: login,
        logout: logout,
        uid: user && user.uid,
        searchTerm: searchTerm,
        setSearchTerm: setSearchTerm,
        searchResults: searchResults,
        setSearchResults: setSearchResults,
    }

    return (
        <authContext.Provider value={authContextValue}>
            { children }
        </authContext.Provider>
    )
}

export function useAuthContext() {
    return useContext(authContext);
}