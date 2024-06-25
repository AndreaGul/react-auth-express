import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext"

export default function (){

    const { logout } = useAuth();

    return(
        <>
        <h1>Sei Loggato</h1>
        <Link to="/create">Crea un nuovo post</Link>
        <div><button onClick={logout} >logout</button></div>
        </>
    )
}