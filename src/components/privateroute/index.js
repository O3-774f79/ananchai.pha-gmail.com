import React from 'react'
import {
    BrowserRouter as Router,
    Route,
    Redirect,
} from 'react-router-dom'
import API from '../../helper';
const PrivateRoute = ({ component: Component, ...rest }) => {
    API.post('api/User/checkToken', { token: localStorage.getItem('token') })
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