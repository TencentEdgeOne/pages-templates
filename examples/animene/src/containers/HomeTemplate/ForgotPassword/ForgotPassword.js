import { Link } from "react-router-dom"
import { Formik, Form, Field, ErrorMessage } from "formik"

import clsx from "clsx"

import styles from "./styles.module.scss"

import Button from "../../../components/ui/Button"
import FormContainer from "../../../components/ui/FormContainer"

import { checkEmail } from "../../../utils/utils"

const Login = () => (
  <FormContainer>
    <h1 className={styles.formTitle}>Reset Password</h1>
    <Formik
      initialValues={{ email: "" }}
      validate={(values) => {
        const errors = {}
        const emailError = checkEmail(values.email)
        if (emailError) errors.email = emailError
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
          <Button
            className={styles.button}
            type="submit"
            disabled={isSubmitting}
          >
            Reset Password
          </Button>
          <Button className={clsx(styles.button, styles.customBtn)}>
            <img
              className={styles.customBtnIcon}
              src="https://img.icons8.com/color/48/000000/google-logo.png"
              alt="google"
            />
            Reset with Google
          </Button>
          <Button className={clsx(styles.button, styles.customBtn)}>
            <img
              className={styles.customBtnIcon}
              src="https://img.icons8.com/fluency/48/000000/facebook-new.png"
              alt="facebook"
            />
            Reset with Facebook
          </Button>
        </Form>
      )}
    </Formik>

    <div className={styles.otherOptionContainer}>
      Got any problems?
      <a
        href="mailto:nguyenhoangtien100501@gmail.com"
        className={styles.otherOption}
      >
        Contact us
      </a>
    </div>
  </FormContainer>
)

export default Login
