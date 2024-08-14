import { Link } from "react-router-dom";
import styles from "./index.module.scss";

const Header = () => {
  return (
    <div className={styles.header}>
      <div className={styles.content}>
        <Link to={"/"}>Blog App</Link>

        <img
          src="https://i.pinimg.com/236x/97/43/ec/9743ecac80966a95e9d328c08b995c04.jpg"
          alt=""
        />
      </div>
    </div>
  );
};

export default Header;
