import React, { useState } from 'react';
import { navigate } from 'gatsby';
import {
  validateEmail,
  validateStrongPassword
} from '../utils';
import * as styles from './signup.module.css';

import AttributeGrid from '../components/AttributeGrid/AttributeGrid';
import Layout from '../components/Layout/Layout';
import FormInputField from '../components/FormInputField/FormInputField';
import Button from '../components/Button';
import { API_BASE_URL } from '../baseUrl';

const SignupPage = (props) => {
  const initialState = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  };

  const errorState = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  };

  const [signupForm, setSignupForm] = useState(initialState);
  const [errorForm, setErrorForm] = useState(errorState);

  const handleChange = (id, e) => {
    const tempForm = { ...signupForm, [id]: e };
    setSignupForm(tempForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let validForm = true;
    const tempError = { ...errorState };


    if (validateEmail(signupForm.email) !== true) {
      tempError.email =
        'Please use a valid email address, such as user@example.com.';
      validForm = false;
    }

    if (validateStrongPassword(signupForm.password) !== true) {
      tempError.password =
        'Password must have at least 8 characters, 1 lowercase, 1 uppercase and 1 numeric character.';
      validForm = false;
    }

    if (validForm === true) {
      const raw = JSON.stringify({
        "email": signupForm.email,
        "password": signupForm.password
      });


      const res = await fetch(`${API_BASE_URL}/customers/signup`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: raw,
      });
      const jwt = JSON.parse(await res.text());
      if (jwt.code === 0) {
        window.localStorage.setItem('auth-token', jwt.authToken);
        navigate('/accountSuccess');

      }
    } else {
      setErrorForm(tempError);
    }
  };

  return (
    <Layout disablePaddingBottom={true}>
      <div className={styles.root}>
        <div className={styles.signupFormContainer}>
          <h1 className={styles.title}>Create Account</h1>
          <span className={styles.subtitle}>
            Please enter your the information below:
          </span>
          <form
            noValidate
            className={styles.signupForm}
            onSubmit={(e) => handleSubmit(e)}
          >
            <FormInputField
              id={'email'}
              value={signupForm.email}
              handleChange={(id, e) => handleChange(id, e)}
              type={'email'}
              labelName={'Email'}
              error={errorForm.email}
            />

            <FormInputField
              id={'password'}
              value={signupForm.password}
              handleChange={(id, e) => handleChange(id, e)}
              type={'password'}
              labelName={'Password'}
              error={errorForm.password}
            />

            <Button fullWidth type={'submit'} level={'primary'}>
              create account
            </Button>
            <span className={styles.reminder}>Have an account?</span>
            <Button
              type={'button'}
              onClick={() => navigate('/login')}
              fullWidth
              level={'secondary'}
            >
              log in
            </Button>
          </form>
        </div>

        <div className={styles.attributeGridContainer}>
          <AttributeGrid />
        </div>
      </div>
    </Layout>
  );
};

export default SignupPage;
