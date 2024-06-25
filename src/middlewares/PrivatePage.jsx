import { useAuth } from "../contexts/AuthContext"
import { Navigate } from "react-router-dom";

export default function ({children}) {

    const { isLoggedIn }  = useAuth();

    if(!isLoggedIn) return <Navigate to="/login"/>
    
    return children
}