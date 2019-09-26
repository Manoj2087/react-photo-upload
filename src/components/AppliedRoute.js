import React from 'react'
import { Route } from "react-router-dom"

export default function AppliedRoute({ component: C, props: cProps, ...rest }) {
    return (
        <div>
            <Route {...rest} render={props => <C {...props} {...cProps} />} />
        </div>        
    )
}
