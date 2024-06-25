import { useAuth } from "../contexts/AuthContext"

export default function () {

    const { login } = useAuth();

    const handleLogin = e =>{
        e.preventDefault();
        login();
    }


    return(
        <>
        <form onSubmit={handleLogin}>
            <input type="text" placeholder="email" />
            <input type="password" placeholder="password" />
            <button>Accedi</button>
        </form>
        </>
    )
}