import { useState } from "react";
import { useAuth } from "../contexts/AuthContext"

export default function () {

    const { login } = useAuth();

    const initialData = {
        email: '',
        password: ''
    }

    const [formData, setFormData] = useState(initialData);

    const [loginError, setLoginError]= useState(null);

    const changeData = (key, value)=>{
        setFormData(curr=>({
            ...curr,
            [key]:value
        }));
    }

    const handleLogin = async e =>{
        e.preventDefault();
        try{
            await login(formData)
            setFormData(initialData)
        }catch(err){
            setLoginError(err)
        }
        
    }


    return(
        <>
        <form onSubmit={handleLogin}>
            <input 
            type="text" 
            placeholder="email" 
            value={formData.email} 
            onChange={e=>changeData('email', e.target.value)} />

            <input 
            type="password" 
            placeholder="password"
            value={formData.password}
            onChange={e=>changeData('password', e.target.value)} />

            {loginError !== null && <div style={{color:"red"}}>{loginError.message}</div>}
            {loginError?.errors && loginError.errors.map((err, index) => (
                <div key={`err${index}`}>{err.msg}</div>
            ))}
            <button>Accedi</button>
        </form>
        </>
    )
}