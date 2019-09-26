import React, { Component } from "react";
import "./ResetPassword.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Auth } from "aws-amplify";
import LoaderButton from "../components/LoaderButton"
import { HelpBlock, Panel, Glyphicon } from "react-bootstrap"
import { Link } from "react-router-dom";

const RequestCodeFormSchema = Yup.object().shape({
    email: Yup.string()
        . email('Invalid email')
        .required('Required'),
});

const ConfirmationFormSchema = Yup.object().shape({
    code: Yup.string()
        .required('Required'),
    password: Yup.string()
        .required('Required'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
});


export class ResetPassword extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
            codeSent: false,
            confirm: false,
            isSendingCode: false,
            isConfirming: false,
        }
    }

    renderRequestCodeForm() {
        return (
            <Formik
                initialValues={{
                    email: '',
                    code: '',
                    password: '',
                    confirmPassword: '',
                }}
                validationSchema={RequestCodeFormSchema}
                onSubmit={async values => {
                    this.setState({isSendingCode: true})
                    try {
                        await Auth.forgotPassword(values.email);
                        // await new Promise(resolve => setTimeout(resolve, 1000));
                        // console.log("sent");
                        this.setState({ codeSent: true });                       
                    } catch (e) {
                        alert(e.message);
                        this.setState({isSendingCode: false})
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
                            <LoaderButton
                                isLoading={this.state.isSendingCode}
                                text="Send Confirmation"
                                loadingText="Sending..."
                                type="submit"
                                className="btn btn-primary mr-2"
                                disabled={false}
                            />
                        </div>
                    </Form>
                )}
        </Formik>
        );
    }

    renderConfirmationForm() {
        return (
            <Formik
                validationSchema={ConfirmationFormSchema}
                onSubmit={async values => {
                    this.setState({isConfirming: true})
                    try {
                        console.log(values);
                        await Auth.forgotPasswordSubmit(
                            values.email,
                            values.code,
                            values.password
                        );
                        // await new Promise(resolve => setTimeout(resolve, 1000));
                        // console.log("Confirm");
                        this.setState({ confirm: true });                    
                    } catch (e) {
                        alert(e.message);
                        this.setState({isConfirming: true});
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
                            <label htmlFor="password">New Password</label>
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
                                isLoading={this.state.isLoading}
                                text="Confirm"
                                loadingText="Confirm..."
                                type="submit"
                                className="btn btn-primary mr-2"
                                disabled={false}
                            />
                        </div>
                    </Form>
                )}
        </Formik>
        );
    }

    renderSuccessMessage() {
        return(
            <div className="success"> 
                <Glyphicon glyph="ok-sign" />
                    <p>Your password has been reset.</p>
                <p>
                    <Link to="/login">
                        Click here to login with your new credentials.
                    </Link>
                </p>
            </div>
        );
    }

    render() {
        return (
            <div className="ResetPassword">
                <Panel>
                    <Panel.Heading>
                    <Panel.Title>Reset Password</Panel.Title>
                    </Panel.Heading>
                    <Panel.Body>
                        {
                            !this.state.codeSent 
                                ? this.renderRequestCodeForm()
                                : !this.state.confirm
                                    ? this.renderConfirmationForm()
                                    : this.renderSuccessMessage()
                        }
                    </Panel.Body>
                </Panel>
            </div>
        )
    }
}

export default ResetPassword
