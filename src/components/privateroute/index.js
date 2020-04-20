import React from 'react'
import {
    BrowserRouter as Router,
    Route,
    Redirect,
} from 'react-router-dom'
import axios from 'axios'
const PrivateRoute = ({ component: Component, ...rest }) => {
    axios.get('http://52.163.210.101:44000/api/User/checkToken?token=' + localStorage.getItem("token"))
        .then(res => console.log(res))
        .catch(err => localStorage.clear("token"))
    return (
        < Route {...rest} render={(props) => (
            localStorage.getItem("token")
                // fakeAuth.isAuthenticated === true
                ? <Component {...props} />
                : <Redirect to={{
                    pathname: '/login',
                    state: { from: props.location }
                }} />
        )} />
    )
}

export default PrivateRoute