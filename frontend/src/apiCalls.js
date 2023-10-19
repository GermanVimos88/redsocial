import axios from "axios";


export const loginCall = async (userCredential, dispatch) => {
    dispatch({ type: "LOGIN_START" });    
    try {        
        const res = await axios.post('http://127.0.0.1:8800/api/auth/login', userCredential);
        dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
    } catch (err) {
        dispatch({ type: "LOGIN_FAILURE", payload: err });
    }
};
