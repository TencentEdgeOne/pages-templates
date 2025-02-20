import React, { useContext, useEffect, useState } from 'react';
import { navigate } from 'gatsby';
import * as styles from './settings.module.css';
import AddressForm from '../../components/AddressForm';
import AccountLayout from '../../components/AccountLayout';
import Button from '../../components/Button';
import Breadcrumbs from '../../components/Breadcrumbs';
import FormInputField from '../../components/FormInputField';
import Layout from '../../components/Layout/Layout';

import {
  validateEmail,
  validateStrongPassword,
  isLoggedIn,
} from '../../utils';
import CartContext from '../../context/CartProvider';
import { updateCustomer } from '../../api/api';

const SettingsPage = () => {
  const { state } = useContext(CartContext);
  const {customer} = state ?? {};

  
  if (isLoggedIn() === false) {
    navigate('/login');
  }

  const initialState = {
    firstName: '',
    lastName: '',
    email: '',
  };

  const errorState = {
    firstName: '',
    lastName: '',
    email: '',
  };

  const [updateForm, setUpdateForm] = useState(initialState);
  const [pwdForm, setPwdForm] = useState({
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState(errorState);

  useEffect(() => {
    if (!customer) return;
    setUpdateForm({
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: customer.email,
    })
  }, [customer]);

  const handleChange = (id, e) => {
    const tempForm = { ...updateForm, [id]: e };
    setUpdateForm(tempForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let validForm = true;
    const tempError = { ...errorState };

    if (updateForm.email !== '') {
      if (validateEmail(updateForm.email) !== true) {
        validForm = false;
        tempError.email =
          'Please use a valid email address, such as user@example.com.';
      }
    }

    
    if (validForm === true) {
      //success
      setError(errorState);
      // call api to update user
      const res = await updateCustomer({
        id: customer.id,
        ...updateForm
      });
      if (res) {
        alert("Successfully updated!");
      }
    } else {
      setError(tempError);
    }
  };

  const handleSubmitPwd = async (e) => {
    e.preventDefault();
    let validForm = true;
    const tempError = { ...errorState };

    if (pwdForm.password !== '') {
      if (validateStrongPassword(pwdForm.password) !== true) {
        validForm = false;
        tempError.password =
          'Please use a strong password, such as <PASSWORD>.';
      }
    }

    if (pwdForm.confirmPassword !== '') {
      if (pwdForm.password !== pwdForm.confirmPassword) {
        validForm = false;
        tempError.confirmPassword =
          'Passwords do not match. Please try again.';
      }
    }

    if (validForm === true) {
      //success
      setError(errorState);
      await updateCustomer({
        id: customer.id,
        password: pwdForm.password,
      });
      setPwdForm({
        password: '',
        confirmPassword: ''
      });
    } else {
      setError(tempError);
    }
  }

  return (
    <Layout>
      <AccountLayout>
        <Breadcrumbs
          crumbs={[
            { link: '/', label: 'Home' },
            { link: '/account', label: 'Account' },
            { link: '/account/settings', label: 'Settings' },
          ]}
        />
        <h1>Settings</h1>
        <div>
          <form onSubmit={(e) => handleSubmit(e)} noValidate>
            <div className={styles.nameSection}>
              <FormInputField
                id={'firstName'}
                value={updateForm.firstName}
                handleChange={(id, e) => handleChange(id, e)}
                type={'input'}
                labelName={'First Name'}
              />
              <FormInputField
                id={'lastName'}
                value={updateForm.lastName}
                handleChange={(id, e) => handleChange(id, e)}
                type={'input'}
                labelName={'Last Name'}
              />
              <FormInputField
                id={'email'}
                value={updateForm.email}
                handleChange={(id, e) => handleChange(id, e)}
                type={'email'}
                labelName={'Email'}
                error={error.email}
              />
                
            </div>
            <Button level={'primary'} type={'submit'}>
              update
            </Button>
          </form>
          <div className={styles.passwordContainer}>
            <h2>Update Address</h2>
            <AddressForm customer={customer}/>
          </div>
          <form onSubmit={(e) => handleSubmitPwd(e)}>
            <div className={styles.passwordContainer}>
              <h2>Change Password</h2>
              <div className={styles.passwordSection}>
                <FormInputField
                  id={'password'}
                  value={pwdForm.password}
                  handleChange={(id, e) => handleChange(id, e)}
                  type={'password'}
                  labelName={'New Password'}
                  error={error.password}
                />
                <FormInputField
                  id={'confirmPassword'}
                  value={pwdForm.confirmPassword}
                  handleChange={(id, e) => handleChange(id, e)}
                  type={'password'}
                  labelName={'Confirm Password'}
                  error={error.confirmPassword}
                />
                <Button level={'primary'} type={'submit'}>
                  update
                </Button>
              </div>
            </div>
          </form>
           
        </div>
      </AccountLayout>
    </Layout>
  );
};

export default SettingsPage;
