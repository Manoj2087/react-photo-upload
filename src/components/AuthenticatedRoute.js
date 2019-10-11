import React from 'react'
import { Route, Redirect } from "react-router-dom"

export default function AuthenticatedRoute({ component: Component, props: cProps, ...rest }) {
    return (
            <Route {...rest} render={props =>
                cProps.isAuthenticated
                    ?
                    <Component {...props} {...cProps} />
                    :
                    <Redirect 
                        to={`/login?redirect=${props.location.pathname}${props.location.search}`}
                    />
                }
            />
    )
}
