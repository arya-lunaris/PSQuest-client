import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext"; 
import { removeToken } from '../../utils/auth';
import './Navbar.css'; 

export default function Navbar() {
  const { user, setUser } = useContext(UserContext); 
  const navigate = useNavigate(); 

  const handleLogout = () => {
    removeToken(); 
    setUser(null); 
    navigate("/"); 
  };

  return (
    <nav className="navbar">
      <ul className="navLinks">
        <li>
          <Link to="/" className="navLink">Home</Link>
        </li>
        <li>
          <Link to="/search" className="navLink">Search</Link>
        </li>
        <li>
          <Link to="/collection" className="navLink">Collection</Link>
        </li>
        <li>
          <Link to="/wishlist" className="navLink">Wishlist</Link>
        </li>

        {!user && (
          <>
            <li>
              <Link to="/signup" className="navLink">Sign Up</Link>
            </li>
            <li>
              <Link to="/login" className="navLink loginLink">Login</Link>
            </li>
          </>
        )}

        {user && (
          <>
            <li>
              <Link to={`/profile/${user.id}`} className="navLink">Profile</Link>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="logoutButton">
                Logout
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
