import React, { Component } from "react";
import "./Login.css";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Auth } from "aws-amplify";
import LoaderButton from "../components/LoaderButton"
import { Link } from "react-router-dom";
import { Panel } from "react-bootstrap"


const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .required('Required'),
    password: Yup.string()
      .required('Required'),
});

export default class Login extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
             isLoading: false
        }
    }

    renderLoginForm() {
        return (
            <div>
                <Formik
                    initialValues={{
                        email: '',
                        password: '',
                    }}
                    validationSchema={LoginSchema}
                    onSubmit={async values => {
                        this.setState({ isLoading: true });
                        try {
                            // await new Promise(resolve => setTimeout(resolve, 1000));
                            // console.log("Login");
                            await Auth.signIn(values.email, values.password);
                            this.props.userHasAuthenticated(true);
                            this.props.history.push("/");
                          } catch (e) {
                            alert(e.message);
                            this.setState({ isLoading: false });
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
                                <p>
                                    <Link to="/login/reset">Forgot password?</Link>
                                </p>
                                <div className="form-group">
                                    <LoaderButton
                                        isLoading={this.state.isLoading}
                                        text="Login"
                                        loadingText="Loggin in.."
                                        type="submit"
                                        className="btn btn-primary mr-2"
                                        disabled={false}
                                    />
                                </div>
                            </Form>
                        )}
                    </Formik>
            </div>
        );
    }
    
    render() { 
        return (
            <div className="Login">
                <Panel>
                    <Panel.Heading>
                    <Panel.Title>Login</Panel.Title>
                    </Panel.Heading>
                    <Panel.Body>
                        { this.renderLoginForm() }
                    </Panel.Body>
                </Panel>
            </div>
        );
    }
}
