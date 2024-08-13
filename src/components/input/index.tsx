import React from 'react';
import styles from './index.module.scss';

interface InputProps {
  type: string;
  name: string;
  placeholder: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  error?: boolean;
  errorMessage?: string;
}

const Input: React.FC<InputProps> = ({
  type,
  name,
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  errorMessage,
}) => {
  return (
    <div className={styles.inputWrapper}>
      {type === 'textarea' ? (
        <textarea
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          className={`${styles.input} ${error ? styles.errorInput : ''}`}
          aria-invalid={error ? 'true' : 'false'}
        />
      ) : (
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          className={`${styles.input} ${error ? styles.errorInput : ''}`}
          aria-invalid={error ? 'true' : 'false'}
        />
      )}
      {error && <div className={styles.errorMessage}>{errorMessage}</div>}
    </div>
  );
};

export default Input;
