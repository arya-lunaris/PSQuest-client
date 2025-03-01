import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext"; 
import { removeToken } from '../../utils/auth';
import styles from "./navbar.module.css";

export default function Navbar() {
  const { user, setUser } = useContext(UserContext); 
  const navigate = useNavigate(); 

  const handleLogout = () => {
    removeToken(); 
    setUser(null); 
    navigate("/login"); 
  };

  return (
    <nav className={styles.navbar}>
      <ul className={styles.navLinks}>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/search">Search</Link>
        </li>
        <li>
          <Link to="/collection">Collection</Link>
        </li>
        <li>
          <Link to="/wishlist">Wishlist</Link>
        </li>

        {!user && (
          <>
            <li>
              <Link to="/signup">Sign Up</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
          </>
        )}

        {user && (
          <>
            <li>
              <Link to={`/profile/${user.id}`}>Profile</Link>
            </li>
            <li>
              <button onClick={handleLogout} className={styles.logoutButton}>
                Logout
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
