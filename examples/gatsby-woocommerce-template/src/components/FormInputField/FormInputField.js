import React from 'react';

import Icon from '../Icons/Icon';
import * as styles from './FormInputField.module.css';

const FormInputField = React.forwardRef((props, ref) => {
  const {
    id,
    type = 'text',
    labelName,
    value,
    pattern,
    min,
    max,
    handleChange,
    placeholder,
    disabled,
    note,
    error,
    required,
    icon,
    options
  } = props;

  return (
    <div className={`formField ${styles.formField}`}>
      {labelName !== undefined && (
        <label htmlFor={id} className={styles.label}>
          {labelName} {required === true ? <span>*</span> : ''}
        </label>
      )}
      {(type === 'text' || type === 'input') && (
        <input
          id={id}
          name={id}
          type="text"
          value={value}
          pattern={pattern}
          placeholder={placeholder}
          className={`${styles.input} ${
            icon ? styles.conditionalIconPadding : ''
          } ${error && error ? styles.fieldRequired : ''}`}
          onChange={(e) => handleChange(id, e.target.value)}
          disabled={disabled}
          ref={ref}
        />
      )}
      {type === 'number' && (
        <input
          id={id}
          name={id}
          type="number"
          min={min}
          max={max}
          value={value}
          pattern={pattern}
          placeholder={placeholder}
          className={`${styles.input} ${
            icon ? styles.conditionalIconPadding : ''
          } ${error && error ? styles.fieldRequired : ''}`}
          onChange={(e) => handleChange(id, e.target.value)}
          disabled={disabled}
          ref={ref}
        />
      )}
      {type === 'password' && (
        <input
          id={id}
          name={id}
          type="password"
          value={value}
          placeholder={placeholder}
          pattern={pattern}
          className={`${styles.input} ${
            icon ? styles.conditionalIconPadding : ''
          } ${error && error ? styles.fieldRequired : ''}`}
          onChange={(e) => handleChange(id, e.target.value)}
          disabled={disabled}
          required={required}
        />
      )}
      {type === 'email' && (
        <input
          id={id}
          name={id}
          type="email"
          value={value}
          pattern={pattern}
          placeholder={placeholder}
          className={`${styles.input} ${
            icon ? styles.conditionalIconPadding : ''
          } ${error && error ? styles.fieldRequired : ''}`}
          onChange={(e) => handleChange(id, e.target.value)}
          disabled={disabled}
          ref={ref}
        />
      )}
      {type === 'textarea' && (
        <textarea
          id={id}
          name={id}
          value={value}
          pattern={pattern}
          className={`${styles.textarea} ${
            icon ? styles.conditionalIconPadding : ''
          } ${error ? styles.fieldRequired : ''}`}
          onChange={(e) => handleChange(id, e.target.value)}
          disabled={disabled}
          ref={ref}
        />
      )}
      {type === 'select' && (
        <select
          id={id}
          name={id}
          value={value}
          placeholder={placeholder}
          className={`${styles.input} ${icon ? styles.conditionalIconPadding : ''
            } ${error && error ? styles.fieldRequired : ''}`}
          onChange={(e) => handleChange(id, e.target.value)}
          disabled={disabled}
          ref={ref}
        >
          {options?.map((option) => (
            <option key={option.code} value={option.code}>
              {option.name}
            </option>
          ))}
        </select>
      )}
      {note && <span className={styles.note}>{note}</span>}
      {error && <span className={'error'}>{error}</span>}
      {icon && (
        <div
          className={`${styles.iconContainer} ${
            labelName !== undefined ? styles.offsetIcon : ''
          }`}
        >
          <Icon symbol={icon} />
        </div>
      )}
    </div>
  );
});

export default FormInputField;
