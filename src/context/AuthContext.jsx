import { createContext, useContext, useEffect, useState } from "react";
import { getBookmarks, getProducts, onUserStateChange } from "../api/firebase";
import { login, logout } from '../api/firebase';

const authContext = createContext();

export function AuthContextProvider({ children }) {
    const [product, setProduct] = useState();
    const [user, setUser] = useState();
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [bookmarks, setBookmarks] = useState([]); // Add bookmarks state

    useEffect(() => {
        onUserStateChange((user) => {
            console.log(user);
            setUser(user);
        });
    }, []);

    useEffect(() => {
        getProducts()
            .then((productData) => {
                setProduct(productData);
            })
            .catch((error) =>{
                console.error(error);
            })
    })

    const authContextValue = {
        user: user,
        login: login,
        logout: logout,
        uid: user && user.uid,
        searchTerm: searchTerm,
        setSearchTerm: setSearchTerm,
        searchResults: searchResults,
        setSearchResults: setSearchResults,
        bookmarks: bookmarks, // Use the bookmarks state
    };

    return (
        <authContext.Provider value={authContextValue}>
            {children}
        </authContext.Provider>
    );
}

export function useAuthContext() {
    return useContext(authContext);
}
