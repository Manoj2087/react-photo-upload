import React from 'react'
import { Route, Redirect } from "react-router-dom"

export default function UnauthenticatedRoute({ component: Component, props: cProps, ...rest }) {
    return (
            <Route {...rest} render={props =>
                !cProps.isAuthenticated
                    ?
                    <Component {...props} {...cProps} />
                    :
                    <Redirect 
                        to={"/"}
                    />
                }
            />
    )
}
