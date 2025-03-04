import { useState, useContext } from 'react';
import { useNavigate } from 'react-router';
import { setToken } from '../../utils/auth';
import { getUserFromToken } from '../../utils/auth';
import { UserContext } from '../../contexts/UserContext';
import { signup } from '../../services/userService';
import './SignupPage.css';  

export default function Signup() {
  const { setUser } = useContext(UserContext);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password_confirmation: '',
    bio: '',
    profile_picture: '' 
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false); 
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await signup(formData); 
      setToken(data.token); 
      setUser(getUserFromToken()); 
      navigate('/login'); 
    } catch (error) {
      setErrors(error.response.data.errors); 
    } finally {
      setLoading(false); 
    }
  };

  const handleChange = (e) => {
    setErrors({ ...errors, [e.target.name]: '' }); 
    setFormData({ ...formData, [e.target.name]: e.target.value }); 
  };

  return (
    <section className="profile-container">
      <h1 className="profile-title">Sign Up</h1>
      <form onSubmit={handleSubmit} className="profile-form">
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            name="username"
            id="username"
            placeholder="Enter a username"
            required
            onChange={handleChange}
          />
          {errors.username && <p className="error-message">{errors.username}</p>}
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Enter an email address"
            required
            onChange={handleChange}
          />
          {errors.email && <p className="error-message">{errors.email}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Enter a password"
            required
            onChange={handleChange}
          />
          {errors.password && <p className="error-message">{errors.password}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="password_confirmation">Confirm password</label>
          <input
            type="password"
            name="password_confirmation"  
            id="password_confirmation"
            placeholder="Re-type the password"
            required
            onChange={handleChange}
          />
          {formData.password &&
            formData.password_confirmation &&
            formData.password !== formData.password_confirmation && (
              <p className="error-message">Passwords do not match</p>
            )}
        </div>

        <div className="form-group">
          <label htmlFor="bio">Bio</label>
          <textarea
            name="bio"
            id="bio"
            placeholder="Tell us about yourself"
            onChange={handleChange}
          />
        </div>

        <button
          className="profile-button"
          disabled={
            formData.password === '' ||
            formData.password !== formData.password_confirmation ||  
            loading
          }
          type="submit"
        >
          {loading ? 'Signing Up...' : 'Sign Up'}
        </button>
      </form>

      <div className="login-link-section">
        <p><a href="/login" className="login-link">Already have an account? Log In</a></p>
      </div>
    </section>
  );
}
