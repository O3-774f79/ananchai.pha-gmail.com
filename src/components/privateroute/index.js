import React from 'react'
import {
    BrowserRouter as Router,
    Route,
    Redirect,
} from 'react-router-dom'
const PrivateRoute = ({ component: Component, ...rest }) => (
    < Route {...rest} render={(props) => (
        localStorage.getItem("login") === "true"
            // fakeAuth.isAuthenticated === true
            ? <Component {...props} />
            : <Redirect to={{
                pathname: '/login',
                state: { from: props.location }
            }} />
    )} />
)

export default PrivateRoute