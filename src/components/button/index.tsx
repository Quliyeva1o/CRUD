import React from "react";
import styles from "./index.module.scss";
import ButtonLoader from "../buttonLoader";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  onClick?: () => void;
  color?: string;
  size?: "small" | "medium" | "large";
  loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  color = "#eb3e8c",
  size = "medium",
  loading = false,
  ...props
}) => {
  return (
    <button
      onClick={onClick}
      className={`${styles.button} ${styles[size]}`}
      style={{ backgroundColor: color }}
      {...props}
    >
      {loading ? <ButtonLoader /> : children }
    </button>
  );
};

export default Button;
