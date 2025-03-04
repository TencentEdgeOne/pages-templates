// Render Prop
import React from "react"
import { Formik, Form, Field, ErrorMessage } from "formik"
import styles from "./styles.module.scss"
import Button from "../ui/Button"
import { Link } from "react-router-dom"
import clsx from "clsx"
const Basic = () => (
  <div className={styles.wrapper}>
    <div className={styles.formContainer}>
      <h1 className={styles.formTitle}>Sign Up Now</h1>
      <Formik
        initialValues={{ email: "", password: "" }}
        validate={(values) => {
          const errors = {}
          if (!values.email) {
            errors.email = "Required"
          } else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
          ) {
            errors.email = "Invalid email address"
          }
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
            <div className={styles.formControl}>
              <label className={styles.label} htmlFor="email">
                Email
              </label>
              <Field
                className={clsx(styles.input)}
                type="email"
                name="email"
                id="email"
              />
              <ErrorMessage
                className={styles.error}
                name="email"
                component="div"
              />
            </div>
            <div className={styles.formControl}>
              <label className={styles.label} htmlFor="password">
                Password
              </label>
              <Field
                className={styles.input}
                type="password"
                name="password"
                id="password"
              />
              <ErrorMessage
                className={styles.error}
                name="password"
                component="div"
              />
            </div>
            <div className={styles.formControl}>
              <label className={styles.label} htmlFor="confirmPassword">
                Confirm Password
              </label>
              <Field
                className={styles.input}
                type="password"
                name="confirmPassword"
                id="confirmPassword"
              />
              <ErrorMessage
                className={styles.error}
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
            {/* <Button className={clsx(styles.button, styles.customBtn)}>
              <img className={styles.customBtnIcon} src="https://img.icons8.com/color/48/000000/google-logo.png" alt="google"/>
              Sign up with Google
            </Button>
            <Button className={clsx(styles.button, styles.customBtn)}>
              <img className={styles.customBtnIcon} src="https://img.icons8.com/fluency/48/000000/facebook-new.png" alt="facebook"/>
              Sign up with Facebook
            </Button> */}
            <div className={styles.forgotPassword}>
              <Link to="/forgot-password">Forgot password?</Link>
            </div>
          </Form>
        )}
      </Formik>

      <div className={styles.otherOptionContainer}>
        Already have an account ?
        <Link to="/login" className={styles.otherOption}>
          Login
        </Link>
      </div>
    </div>
  </div>
)

export default Basic
