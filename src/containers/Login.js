import React, { useState } from "react";
import "./Login.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Auth } from "aws-amplify";
import LoaderButton from "../components/LoaderButton";
import { Link } from "react-router-dom";
import { Panel } from "react-bootstrap";


const LoginSchema = Yup.object().shape({
    email: Yup.string()
        . email('Invalid email')
        .required('Required'),
    password: Yup.string()
        .required('Required'),
});


export default function Login(props) {
    const [isLoading, setIsLoading] = useState(false);

    function renderLoginForm() {
        return (
            <div>
                <Formik
                    initialValues={{
                        email: '',
                        password: '',
                    }}
                    validationSchema={LoginSchema}
                    onSubmit={async values => {
                        setIsLoading(true);
                        try {
                            // await new Promise(resolve => setTimeout(resolve, 1000));
                            // console.log("Login");
                            await Auth.signIn(values.email, values.password);
                            props.userHasAuthenticated(true);
                            // props.history.push("/");
                          } catch (e) {
                            alert(e.message);
                            setIsLoading(false);
                        }
                      }}
                    >
                        {({ errors, touched }) => (
                            <Form>
                                <div className="form-group">
                                    <label htmlFor="email">Email</label>
                                    <Field name="email" type="text" className={'form-control' + (errors.email && touched.email ? ' is-invalid' : '')} />
                                    <ErrorMessage name="email" component="div" className="invalid-feedback" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="password">Password</label>
                                    <Field name="password" type="password" className={'form-control' + (errors.password && touched.password ? ' is-invalid' : '')} />
                                    <ErrorMessage name="password" component="div" className="invalid-feedback" />
                                </div>
                                <div className="form-group">
                                    <LoaderButton
                                        isLoading={isLoading}
                                        text="Login"
                                        loadingText="Loggin in.."
                                        type="submit"
                                        className="btn btn-primary mr-2"
                                        disabled={false}
                                    />
                                </div>
                                <p>
                                    <Link to="/login/reset">Forgot password?</Link>
                                </p>
                            </Form>
                        )}
                    </Formik>
            </div>
        );
    }

    return (
        <div>
            <div className="Login">
                <Panel>
                    <Panel.Heading>
                    <Panel.Title>Login</Panel.Title>
                    </Panel.Heading>
                    <Panel.Body>
                        { renderLoginForm() }
                    </Panel.Body>
                </Panel>
            </div>
        </div>
    )
}