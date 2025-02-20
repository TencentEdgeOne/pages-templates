import React, { useEffect, useState } from 'react';
import * as styles from './AddressForm.module.css';

import Button from '../Button';
import FormInputField from '../FormInputField';
import { updateCustomer } from '../../api/api';
import Config from '../../utils/config.json';

const AddressForm = (props) => {
  const { customer } = props;
  const initialState = {
    firstName: '',
    lastName: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    country: '',
    postcode: '',
    phone: ''
  };

  const errorState = {
    firstName: '',
    lastName: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    country: '',
    postcode: '',
    phone: ''
  };

  const [form, setForm] = useState(initialState);
  const [errorForm, setErrorForm] = useState(errorState);

  const handleChange = (id, e) => {
    const tempForm = { ...form, [id]: e };
    setForm(tempForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateCustomer({
      id: customer.id,
      shipping: {
        ...form,
      }
    })
    setErrorForm(errorState);
  };

  useEffect(() => { 
    if (customer) {
      const shipping = customer.shipping;
      setForm({
        firstName: shipping.firstName,
        lastName: shipping.lastName,
        address1: shipping.address1,
        address2: shipping.address2,
        city: shipping.city,
        state: shipping.state,
        country: shipping.country,
        postcode: shipping.postcode,
        phone: shipping.phone
      });
    }
  }, [customer]);

  return (
    <div className={styles.root}>
      <form onSubmit={(e) => handleSubmit(e)}>
        <div className={styles.inputContainer} >
          <FormInputField
            id={'firstName'}
            value={form.firstName}
            handleChange={(id, e) => handleChange(id, e)}
            type={'input'}
            labelName={'First Name'}
            error={errorForm.firstName}
          />
          <FormInputField
            id={'lastName'}
            value={form.lastName}
            handleChange={(id, e) => handleChange(id, e)}
            type={'input'}
            labelName={'Last Name'}
            error={errorForm.lastName}
          />
          <FormInputField
            id={'phone'}
            value={form.phone}
            handleChange={(id, e) => handleChange(id, e)}
            type={'input'}
            labelName={'Phone'}
            error={errorForm.phone}
          />
          <FormInputField
            id={'country'}
            value={form.country}
            handleChange={(id, e) => handleChange(id, e)}
            type={'select'}
            labelName={'Country'}
            options={Config.countries}
            error={errorForm.country}
          />
          <FormInputField
            id={'state'}
            value={form.state}
            handleChange={(id, e) => handleChange(id, e)}
            type={'input'}
            labelName={'State'}
            error={errorForm.state}
          />
          <FormInputField
            id={'city'}
            value={form.city}
            handleChange={(id, e) => handleChange(id, e)}
            type={'input'}
            labelName={'City'}
            error={errorForm.city}
          />
          <FormInputField
            id={'address1'}
            value={form.address1}
            handleChange={(id, e) => handleChange(id, e)}
            type={'input'}
            labelName={'Address1'}
            error={errorForm.address1}
          />
          <FormInputField
            id={'address2'}
            value={form.address2}
            handleChange={(id, e) => handleChange(id, e)}
            type={'input'}
            labelName={'Address2'}
            error={errorForm.address2}
          />
          <FormInputField
            id={'postcode'}
            value={form.postcode}
            handleChange={(id, e) => handleChange(id, e)}
            type={'number'}
            labelName={'Postal Code'}
            error={errorForm.postcode}
          />
        </div>
       
        <div className={styles.actionContainers}>
          <Button fullWidth type={'submit'} level={'primary'}>
            Save
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddressForm;
