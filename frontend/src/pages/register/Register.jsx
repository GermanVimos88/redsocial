import axios from "axios";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./register.css";

export default function Register () {
    const username = useRef();
    const email = useRef();
    const password = useRef();
    const passwordAgain = useRef();    
    const history = useNavigate();

    const handleClick = async (e) => {
        e.preventDefault();
        if(passwordAgain.current.value !== password.current.value) {
            passwordAgain.current.setCustomValidity("Passwords no iguales");
        } else {
            const user = {
                username: username.current.value,
                email: email.current.value,
                password: password.current.value,
            };
            try {
                await axios.post("/auth/register", user);
                history.push("login");
            } catch (err) {
                console.log(err);
            }            
        }
    };

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
                    <input className="loginInput" required ref={username} placeholder="Username" />
                    <input className="loginInput" required ref={email} placeholder="Email" type="email" />
                    <input className="loginInput" required ref={password} placeholder="Password" type="password" minLength="6 " />
                    <input className="loginInput" required ref={passwordAgain} placeholder="Password confirmar" type="password" />
                    <button className="loginButton" type="submit">Sign Up</button>
                    
                    <button className="loginRegisterButton">
                        Ingresar a su cuenta
                    </button>
                </form>
            </div>
        </div>
    </div>
  )
}