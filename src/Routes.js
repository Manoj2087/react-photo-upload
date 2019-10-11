import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./containers/Home";
import PageNotFound from "./containers/PageNotFound";
import Login from "./containers/Login";
import AppliedRoute from "./components/AppliedRoute";
import ResetPassword from "./containers/ResetPassword";
import SignUp from "./containers/SignUp";
import VerifySignUp from "./containers/VerifySignUp";
import UnauthenticatedRoute from "./components/UnauthenticatedRoute";

export default function Routes({ childProps }) {
    return (
        <Switch>
            <AppliedRoute path="/" exact component={Home} props={childProps} />
            <UnauthenticatedRoute path="/login" exact component={ Login } props={childProps} />
            <UnauthenticatedRoute path="/login/reset" exact component={ ResetPassword } props={childProps} />
            <UnauthenticatedRoute path="/signup" exact component={ SignUp } props={childProps} />
            <UnauthenticatedRoute path="/signup/verify" exact component={ VerifySignUp } props={childProps} />
            {/* Finally, catch all unmatched routes */}
            <Route component={ PageNotFound } />
        </Switch>
    )
}
