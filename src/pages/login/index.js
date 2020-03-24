import React, { useState } from 'react'
import logoLogin from '../../img/logo-login.jpg'
import bgLogin from '../../img/BG-login.jpg'
import {
    BrowserRouter as Router, Redirect
} from 'react-router-dom'
const Login = props => {
    const [login, setLogin] = useState(false)
    const [username, setUsername] = useState()
    const [password, setPassword] = useState()
    const handleSubmit = () => {
        if (username !== "admin" || password !== "admin") {
            return false
        } else {
            localStorage.setItem("login", true)
            setLogin(true)
        }
    }
    if (login === true) {
        console.log("else");
        return <Redirect to={'/'} push={true}/>
    }
    return (
        <div>
            <div class="container pt-5">
                <div class="row pt-5">
                    <div class="col-md-6 offset-md-3 mt-5 rounded-box p-3">
                        <div class="text-center mb-2" >
                            <img src={logoLogin} width="200" height="auto" />
                        </div>
                        <div class="form-group col-md-8 offset-md-2 text-center">
                            <input type="text" class="form-control" placeholder="Login" onChange={event => setUsername(event.target.value)} />
                            <br />
                            <input type="password" class="form-control" placeholder="Password" onChange={event => setPassword(event.target.value)} />
                            <br />
                            <button class="btn btn-primary btn-block" onClick={() => handleSubmit()}> LOGIN </button>
                        </div>
                    </div>
                </div>
                <div style={{
                    position: "fixed",
                    left: 0,
                    bottom: 0,
                    width: "100%"
                }}>
                    <img src={bgLogin} width={"100%"} />
                </div>
            </div>
        </div>
    )
}
export default Login