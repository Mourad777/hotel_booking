import React from 'react'
import { Redirect, Route } from 'react-router-dom'

const PrivateRoute = ({ component: Component, isLoggedIn, ...rest }) => {

    return (
        <Route
            exact
            {...rest}
            render={props =>
                isLoggedIn ? (
                    <Component {...rest} />
                ) : (
                    <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
                )
            }
        />
    )
}

export default PrivateRoute