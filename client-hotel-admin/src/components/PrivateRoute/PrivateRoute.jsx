import React from 'react'
import { Redirect, Route } from 'react-router-dom'

const PrivateRoute = ({ component: Component, key, isLoggedIn, ...rest }) => {
    return (
        <Route
            exact
            {...rest}
            render={props =>
                isLoggedIn ? (
                    <Component key={{ ...rest }.path} {...rest} />
                ) : (
                    <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
                )
            }
        />
    )
}

export default PrivateRoute