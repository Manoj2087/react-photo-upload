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

export default function Routes({ appProps }) {
    return (
        <Switch>
            <AppliedRoute path="/" exact component={Home} appProps={appProps} />
            <UnauthenticatedRoute path="/login" exact component={ Login } appProps={appProps} />
            <UnauthenticatedRoute path="/login/reset" exact component={ ResetPassword } appProps={appProps} />
            <UnauthenticatedRoute path="/signup" exact component={ SignUp } appProps={appProps} />
            <UnauthenticatedRoute path="/signup/verify" exact component={ VerifySignUp } appProps={appProps} />
            {/* Finally, catch all unmatched routes */}
            <Route component={ PageNotFound } />
        </Switch>
    );
}
