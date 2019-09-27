import React, { Component } from "react";
import "./VerifySignUp.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Auth } from "aws-amplify";
import LoaderButton from "../components/LoaderButton";
import { HelpBlock, Panel, Glyphicon } from "react-bootstrap"
import { Link } from "react-router-dom";

const ResendVerificationSchema = Yup.object().shape({
    email: Yup.string()
        . email('Invalid email')
        .required('Required'),
});

const SubmitVerificationSchema = Yup.object().shape({
    code: Yup.string()
        .required('Required'),        
});

export class VerifySignUp extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
             resendVerification: false,
             isResendingVerification: false,
             submitVerification: false,
             isSubmittingVerification: false,
        }
    }

    renderResendVerificationForm() {
        return (
            <Formik
                initialValues={{
                    email: '',
                    code: '',
                }}
                validationSchema={ResendVerificationSchema}
                onSubmit={async values => {
                    this.setState({ isResendingVerification: true });
                    try {
                        // await new Promise(resolve => setTimeout(resolve, 1000));
                        // console.log("Verify");
                        await Auth.resendSignUp(values.email);
                        this.setState({ resendVerification: true })
                    } catch (e) {
                        alert(e.message);
                        this.setState({ isResendingVerification: false })
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
                                isLoading={this.state.isResendingVerification}
                                text="Resend Verification Code"
                                loadingText="Resending Verification Code..."
                                type="submit"
                                className="btn btn-primary mr-2"
                                disabled={false}
                            />
                        </div>
                    </Form>
                )}
            </Formik>
        )
    }

    renderSubmitVerificationForm() {
        return (
            <Formik
                validationSchema={SubmitVerificationSchema}
                onSubmit={async values => {
                    this.setState({ isSubmittingVerification: true });
                    try {
                        // await new Promise(resolve => setTimeout(resolve, 1000));
                        // console.log("Verify");
                        await Auth.confirmSignUp(values.email, values.code);
                        this.setState({ submitVerification: true })
                    } catch (e) {
                        alert(e.message);
                        this.setState({ isSubmittingVerification: false })
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
                                isLoading={this.state.isSubmittingVerification}
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
        )
    }

    renderSuccessMessage() {
        return(
            <div className="success"> 
                <Glyphicon glyph="ok-sign" />
                    <p>Your user conifirmation complete</p>
                <p>
                    <Link to="/login">
                        Click here to login.
                    </Link>
                </p>
            </div>
        );
    }
    
    render() {
        return (
            <div className="SignUp">
                <Panel>
                    <Panel.Heading>
                    <Panel.Title>Sign Up Confirmation</Panel.Title>
                    </Panel.Heading>
                    <Panel.Body>
                        { 
                            !this.state.resendVerification
                                ? this.renderResendVerificationForm()
                                : !this.state.submitVerification
                                    ? this.renderSubmitVerificationForm()
                                    : this.renderSuccessMessage()
                        }
                    </Panel.Body>
                </Panel>
            </div>
        )
    }
}

export default VerifySignUp
