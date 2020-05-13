import React, { useState } from 'react'
import logoLogin from '../../img/logo-login.jpg'
import bgLogin from '../../img/BG-login.jpg'
import { Redirect } from 'react-router-dom'
import { message, Spin } from 'antd';
import API from '../../helper';

const error = (data) => {
    if (data) {
        message.error(data);
    } else {
        message.error('กรุณาตรวจสอบ username และ password');
    }
};
const Login = props => {
    const [login, setLogin] = useState(false)
    const [loading, setLoading] = useState(false)
    const [username, setUsername] = useState()
    const [password, setPassword] = useState()
    const handleSubmit = (event) => {
        setLoading(true)
        event.preventDefault();
        API.post('api/User/authenticate',
            { "email": username, "password": password }
        ).then(resp => {
            localStorage.setItem("token", resp.data.token)
            localStorage.setItem("firstName", resp.data.firstName)
            localStorage.setItem("lastName", resp.data.lastName)
            localStorage.setItem("role", resp.data.role)
            sessionStorage.setItem('token', resp.data.token);
            setLogin(true)
            setLoading(false)
        }).catch(async err => {
            if (err.response.status === 429) {
                error(err.response.data)
            } else {
                error()
            }
            await setUsername("")
            await setPassword("")
            await setLoading(false)
        })
    }
    if (login == true) {
        return <Redirect to={{ pathname: '/', }} push={true} />
    }
    return (
        <Spin spinning={loading} >
            <form onSubmit={(event) => handleSubmit(event)}>
                <div class="container pt-5">
                    <div class="row pt-5">
                        <div class="col-md-6 offset-md-3 mt-5 rounded-box p-3">
                            <div class="text-center mb-2" >
                                <img src={logoLogin} width="200" height="auto" />
                            </div>
                            <div class="form-group col-md-8 offset-md-2 text-center">
                                <input type="text" class="form-control" placeholder="Username" value={username} onChange={event => setUsername(event.target.value)} />
                                <br />
                                <input type="password" class="form-control" placeholder="Password" value={password} onChange={event => setPassword(event.target.value)} />
                                <br />
                                <button type="submit" class="btn btn-primary btn-block"> LOGIN </button>
                            </div>
                        </div>
                    </div>
                    <div style={{
                        position: "fixed",
                        left: 0,
                        bottom: 0,
                        width: "100%",
                        zIndex: -1

                    }}>
                        <img src={bgLogin} width={"100%"} />
                    </div>
                </div>
            </form>
        </Spin >
    )
}
export default Login