import React, { useState } from 'react';
import { validateEmail } from '../utils';
import * as styles from './forgot.module.css';

import Layout from '../components/Layout/Layout';
import FormInputField from '../components/FormInputField/FormInputField';
import Button from '../components/Button';
import AttributeGrid from '../components/AttributeGrid';

const ForgotPage = (props) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateEmail(email) !== true) {
      setError('Not a valid email address');
      return;
    }
    setEmail('');
    setError('');
  };

  return (
    <Layout disablePaddingBottom>
      <div className={styles.root}>
        <h1 className={styles.title}>Reset Password</h1>
        <p className={styles.message}>
          Fill in your email below to request a new password. An email will be
          sent to the address below containing a link to verify your email
          address.
        </p>
        <form
          className={styles.formContainer}
          noValidate
          onSubmit={(e) => handleSubmit(e)}
        >
          <FormInputField
            id={'email'}
            value={email}
            handleChange={(_, e) => setEmail(e)}
            type={'email'}
            labelName={'Email'}
            error={error}
          />
          <div className={styles.buttonContainer}>
            <Button fullWidth level={'primary'} type={'submit'}>
              reset password
            </Button>
          </div>
        </form>
      </div>
      <div className={styles.gridContainer}>
        <AttributeGrid />
      </div>
    </Layout>
  );
};

export default ForgotPage;
