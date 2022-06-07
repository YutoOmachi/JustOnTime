import React, {useState} from "react";
import "./login.css";

function Login() {

    const [errorMessageUser, setErrorMessageUser] = useState("");
    const [errorMessagePass, setErrorMessagePass] = useState("");


     const errors = {
        username: "Username Required",
        usernotfound: "Username not found",
        password: "Password Required",
        passnotfound: "Invalid Password"
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        var User = document.getElementById("User").value; 
        var Pass = document.getElementById("Pass").value;
        
        if(User === "" || Pass === ""){
            if (User === ""  && Pass === ""){
                setErrorMessageUser(errors.username)
                setErrorMessagePass(errors.password)
            } else if (User === ""){
                setErrorMessagePass("")
                setErrorMessageUser(errors.username)
            } else if (Pass === "") {
                setErrorMessageUser("")
                setErrorMessagePass(errors.password)
            }
        } else {
            console.log(User)
            console.log(Pass)
            //if password and username are valid 
            // setUserErrorMessage("")
            // setPassErrorMessagse("")
            // setMessage("Login Success")
            //redirect 
            // else if user invalid 
            // setUserErrorMessage(errors.usernotfound)
            // setPassErrorMessage("")
            // setMessage("")
            // else if password invalid 
            // setUserErrorMessage(errors.password)
            // setPassErrorMessage("")
            // setMessage("")

        }


    }


    const renderForm = (
        <div className= "Login-cont">
            <div className="title">Login</div>
            <form onSubmit={handleSubmit}>
                <div className="User-input">
                <label id= "user-label">Username:</label> 
                <input id= "User" type= "text" placeholder= "Enter Username"/>
                {errorMessageUser && <div className="error"> {errorMessageUser} </div>}
                </div>

                <div className="Pass-input">
                <label id= "pass-label">Password:</label> 
                <input id= "Pass" type= "password" placeholder= "Enter Password"/>
                {errorMessagePass && <div className="error"> {errorMessagePass} </div>}
                </div>
                <div className="login-buttons">
                <a id= "create-button" href= "/signup">Create a new account</a>
                <button id= "login-button">Login</button>
                </div>
            </form>


        </div>
    )

    return (
        <div className="Login">
            {renderForm}
        </div>
    );
}
   export default Login;
  