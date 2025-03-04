import { Link } from "react-router-dom"
import { Formik, Form, Field, ErrorMessage } from "formik"
import { PATHS } from "../../../routes"
import clsx from "clsx"

import styles from "./styles.module.scss"

import Button from "../../../components/ui/Button"
import FormContainer from "../../../components/ui/FormContainer"

import {
  checkEmail,
  checkPassword,
  checkConfirmPassword
} from "../../../utils/utils"

const SignUp = () => (
  <FormContainer>
    <h1 className={styles.formTitle}>Sign Up Now</h1>
    <Formik
      initialValues={{ email: "", password: "", confirmPassword: "" }}
      validate={(values) => {
        const errors = {}
        const emailError = checkEmail(values.email)
        const passwordError = checkPassword(values.password)
        const confirmPasswordError = checkConfirmPassword(
          values.password,
          values.confirmPassword
        )
        if (emailError) errors.email = emailError
        if (passwordError) errors.password = passwordError
        if (confirmPasswordError) errors.confirmPassword = confirmPasswordError
        return errors
      }}
      onSubmit={(values, { setSubmitting }) => {
        setTimeout(() => {
          alert(JSON.stringify(values, null, 2))
          setSubmitting(false)
        }, 400)
      }}
    >
      {({ isSubmitting }) => (
        <Form className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <Field type="email" name="email" id="email" />
            <ErrorMessage
              className="error-message"
              name="email"
              component="div"
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <Field type="password" name="password" id="password" />
            <ErrorMessage
              className="error-message"
              name="password"
              component="div"
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <Field
              type="password"
              name="confirmPassword"
              id="confirmPassword"
            />
            <ErrorMessage
              className="error-message"
              name="confirmPassword"
              component="div"
            />
          </div>
          <Button
            className={styles.button}
            type="submit"
            disabled={isSubmitting}
          >
            Sign Up
          </Button>
          <div className={styles.forgotPassword}>
            <Link to={PATHS.FORGOT_PASSWORD}>Forgot password?</Link>
          </div>
        </Form>
      )}
    </Formik>

    <div className={styles.otherOptionContainer}>
      Already have an account?
      <Link to={PATHS.LOGIN} className={styles.otherOption}>
        Login
      </Link>
    </div>
  </FormContainer>
)

export default SignUp
