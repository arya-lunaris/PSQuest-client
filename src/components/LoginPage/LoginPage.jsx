import { useState, useContext } from 'react';
import { useNavigate } from 'react-router';
import { setToken, getUserFromToken } from '../../utils/auth';
import { UserContext } from '../../contexts/UserContext';
import { login } from '../../services/userService';
import './LoginPage.css';

export default function Login() {
    const { setUser } = useContext(UserContext);
    const [formData, setFormData] = useState({
        identifier: '',
        password: '',
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = await login(formData);
            setToken(data.token);
            setUser(getUserFromToken());
            navigate('/');
        } catch (error) {
            console.error("Login Error:", error.response);

            if (error.response?.status === 401) {
                setErrors({ general: 'Invalid username, email, or password' });
            } else {
                setErrors({ general: 'An unexpected error occurred' });
            }
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
            <h1 className="profile-title">Welcome Back</h1>
            <form onSubmit={handleSubmit} className="profile-form">
                <div className="form-group">
                    <label htmlFor="identifier">Username or Email</label>
                    <input
                        type="text"
                        name="identifier"
                        id="identifier"
                        placeholder="Enter your username or email"
                        required
                        onChange={handleChange}
                    />
                    {errors.identifier && <p className="error-message">{errors.identifier}</p>}
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        name="password"
                        id="password"
                        placeholder="Enter your password"
                        required
                        onChange={handleChange}
                    />
                    {errors.password && <p className="error-message">{errors.password}</p>}
                </div>

                {errors.general && <p className="error-message">{errors.general}</p>}

                <button
                    className="profile-button"
                    disabled={formData.identifier === '' || formData.password === '' || loading}
                    type="submit"
                >
                    {loading ? 'Logging in...' : 'Log In'}
                </button>
            </form>

            <div className="signup-link-section">
                <p><a href="/signup" className="signup-link">Don't have an account? Sign Up</a></p>
            </div>
        </section>
    );
}
