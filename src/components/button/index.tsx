import React from 'react';
import styles from './index.module.scss';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  onClick?: () => void;
  color?: string;
  size?: 'small' | 'medium' | 'large';
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  color = "#eb3e8c",
  size = "medium",
  ...props
}) => {
  return (
    <button
      onClick={onClick}
      className={`${styles.button} ${styles[size]}`}
      style={{ backgroundColor: color }}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
