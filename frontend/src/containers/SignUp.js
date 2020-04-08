import React, { useState } from "react";
import "./SignUp.css";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Auth } from "aws-amplify";
import LoaderButton from "../components/LoaderButton";
import { HelpBlock, Panel } from "react-bootstrap";
import { Link } from "react-router-dom";

const SignUpSchema = Yup.object().shape({
    email: Yup.string()
        . email('Invalid email')
        .required('Required'),
    password: Yup.string()
        .required('Required'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match'),
});

const SignUpConfirmationSchema = Yup.object().shape({
    code: Yup.string()
        .required('Required'),
});

export default function SignUp(props) {
    const [signUpSent, setSignUpSent] = useState(false);
    const [isSendingSignUp, setIsSendingSignUp] = useState(false);
    const [isSendingConfirmation, setIsSendingConfirmation] = useState(false);

    function renderSignUpForm() {
        return (
            <div>
                <Formik
                    initialValues={{
                        email: '',
                        password: '',
                        confirmPassword: '',
                        code: '',
                    }}
                    validationSchema={SignUpSchema}
                    onSubmit={async values => {
                        setIsSendingSignUp(true);
                        try {
                            await Auth.signUp({
                                username: values.email,
                                password: values.password,
                            })
                            // await new Promise(resolve => setTimeout(resolve, 1000));
                            // console.log("signup");                           
                            setSignUpSent(true);
                          } catch (e) {
                            alert(e.message);
                            setIsSendingSignUp(false);
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
                                    <label htmlFor="confirmPassword">Confirm Password</label>
                                    <Field name="confirmPassword" type="password" className={'form-control' + (errors.confirmPassword && touched.confirmPassword ? ' is-invalid' : '')} />
                                    <ErrorMessage name="confirmPassword" component="div" className="invalid-feedback" />
                                </div>
                                <div className="form-group">
                                    <LoaderButton
                                        isLoading={isSendingSignUp}
                                        text="Sign Up"
                                        loadingText="Signing Up..."
                                        type="submit"
                                        className="btn btn-primary mr-2"
                                        disabled={false}
                                    />
                                </div>
                                <p>
                                    <Link to="/signup/verify">Click here to resend confirmation code for already signed up account</Link>
                                </p>
                            </Form>
                        )}
                    </Formik>
            </div>
        );
    }

    function renderSignUpConfirmationForm() {
        return (
            <div>
                <Formik
                    validationSchema={SignUpConfirmationSchema}
                    onSubmit={async values => {
                        setIsSendingConfirmation(true);
                        try {
                            // await new Promise(resolve => setTimeout(resolve, 1000));
                            // console.log("signup confirmation");
                            await Auth.confirmSignUp(values.email, values.code);
                            await Auth.signIn(values.email, values.password);
                            props.userHasAuthenticated(true);
                            props.history.push("/");
                          } catch (e) {
                            alert(e.message);
                            setIsSendingConfirmation(false);
                        }
                      }}
                    >
                        {({ errors, touched, values }) => (
                            <Form>
                                <div className="form-group">
                                    <label htmlFor="code">Confirmation Code</label>
                                    <Field name="code" type="text" className={'form-control' + (errors.code && touched.code ? ' is-invalid' : '')} />
                                    <ErrorMessage name="code" component="div" className="invalid-feedback" />
                                    <HelpBlock>
                                        Please check your email ({values.email}) for the confirmation code.
                                    </HelpBlock>
                                </div>
                                <div className="form-group">
                                    <LoaderButton
                                        isLoading={isSendingConfirmation}
                                        text="Verify"
                                        loadingText="Verifing..."
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

    return (
        <div className="SignUp">
            <Panel>
                <Panel.Heading>
                <Panel.Title>Sign Up</Panel.Title>
                </Panel.Heading>
                <Panel.Body>
                    { 
                        !signUpSent
                            ? renderSignUpForm()
                            : renderSignUpConfirmationForm()
                    }
                </Panel.Body>
            </Panel>
        </div>
    )
}