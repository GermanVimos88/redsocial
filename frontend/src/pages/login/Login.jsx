import { useContext, useRef } from "react";
import "./login.css";
import { loginCall } from "../../apiCalls";
import { AuthContext } from "../../context/AuthContext";
import CircularProgress from '@mui/material/CircularProgress';  

export default function Login () {
    const email = useRef();
    const password = useRef();
    const { isFetching, dispatch } = useContext(AuthContext);

    const handleClick = (e) => {
        e.preventDefault();
        loginCall(
            { email: email.current.value, password: password.current.value },
            dispatch
        );
    };
    //console.log(user)

  return (
    <div className="login">
        <div className="loginWrapper">
            <div className="loginLeft">
                <h3 className="loginLogo">Red social</h3>
                <span className="loginDesc">
                    Conéctate con tus amigos
                </span>
            </div>
            <div className="loginRight">
                <form className="loginBox" onSubmit={handleClick} >
                    <input 
                        className="loginInput" 
                        type="email" 
                        required 
                        placeholder="Email" 
                        ref={email} 
                    />
                    <input 
                        className="loginInput"
                        type="password"
                        required
                        minLength="6"
                        placeholder="Password"
                        ref={password}
                    />
                    <button className="loginButton" type="submit" disabled={isFetching}>
                        {isFetching ? (<CircularProgress color="success" size="20px" />
                        ) : (
                            "Log In"
                        )}
                    </button>
                    <span className="loginForgot">Olvidó su contraseña</span>
                    <button className="loginRegisterButton">
                        {isFetching ? (
                            <CircularProgress color="success" size="20px" />
                            ) : (
                                "Crear una nueva cuenta"
                        )}                        
                    </button>
                </form>
            </div>
        </div>
    </div>
  );
}