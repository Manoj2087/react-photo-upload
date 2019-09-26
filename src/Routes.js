import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./containers/Home";
import PageNotFound from "./containers/PageNotFound";
import Login from "./containers/Login";
import AppliedRoute from "./components/AppliedRoute";
import ResetPassword from "./containers/ResetPassword";

export default function Routes({ childProps }) {
    return (
        <Switch>
            <AppliedRoute path="/" exact component={Home} props={childProps} />
            <AppliedRoute path="/login" exact component={ Login } props={childProps} />
            <AppliedRoute path="/login/reset" exact component={ ResetPassword } props={childProps} />
            {/* Finally, catch all unmatched routes */}
            <Route component={ PageNotFound } />
        </Switch>
    )
}
