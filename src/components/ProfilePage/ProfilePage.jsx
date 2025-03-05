import { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";
import { getUserProfile, updateUserProfile } from "../../services/userService";
import './ProfilePage.css';

export default function UpdateProfile() {
    const { user, setUser } = useContext(UserContext);
    const { userId } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        password_confirmation: "",
        bio: "",
        profile_picture: ""
    });

    const [errors, setErrors] = useState({});
    const [passwordValid, setPasswordValid] = useState(true);

    const fetchUserProfile = async () => {
        try {
            const fetchedUser = await getUserProfile();
            setFormData({
                username: fetchedUser.username || "",
                email: fetchedUser.email || "",
                bio: fetchedUser.bio ?? "",
                password: "",
                password_confirmation: ""
            });
        } catch (error) {
            setErrors({ general: "Failed to load profile data." });
        }
    };

    useEffect(() => {
        if (!user) {
            navigate("/login");
            return;
        }

        if (user.id !== parseInt(userId)) {
            setErrors({ message: "You don't have permission to edit this profile." });
            return;
        }

        fetchUserProfile();
    }, [user, userId, navigate]);

    const handleChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });

        if (event.target.name === "password") {
            const password = event.target.value;
            setPasswordValid(validatePassword(password));
        }
    };

    const validatePassword = (password) => password.length >= 8;

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (formData.password && formData.password !== formData.password_confirmation) {
            setErrors({ password_confirmation: "Passwords do not match" });
            return;
        }

        const updatedFormData = { ...formData };
        if (!formData.password) {
            delete updatedFormData.password;
            delete updatedFormData.password_confirmation;
        }

        try {
            await updateUserProfile(updatedFormData);
            const updatedUser = await getUserProfile();
            setUser(updatedUser);
            navigate("/collection");
        } catch (error) {
            if (error.response && error.response.data) {
                const errorData = error.response.data;
                setErrors({
                    username: errorData.username ? errorData.username[0] : null,
                    email: errorData.email ? errorData.email[0] : null,
                    password: errorData.password ? errorData.password[0] :
                        errorData.non_field_errors ? errorData.non_field_errors[0] : null,
                    password_confirmation: errorData.password_confirmation ? errorData.password_confirmation[0] : null,
                    general: !errorData.password && errorData.non_field_errors ? errorData.non_field_errors[0] : null,
                });

            } else {
                setErrors({ general: "Failed to update profile. Please try again." });
            }
        }
    };

    return (
        <div className="profile-container">
            <h1 className="profile-title">Update Your Profile</h1>

            <form className="profile-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Username:</label>
                    <input type="text" name="username" value={formData.username} onChange={handleChange} required />
                    {errors.username && <p className="error-message">{errors.username}</p>}
                </div>

                <div className="form-group">
                    <label>Email:</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                    {errors.email && <p className="error-message">{errors.email}</p>}
                </div>

                <div className="form-group">
                    <label>New Password:</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} />
                    {errors.password && <p className="error-message">{errors.password}</p>}
                    {!passwordValid && formData.password && (
                        <p className="error-message">Password must be at least 8 characters long.</p>
                    )}
                </div>

                <div className="form-group">
                    <label>Confirm Password:</label>
                    <input type="password" name="password_confirmation" value={formData.password_confirmation} onChange={handleChange} />
                    {errors.password_confirmation && <p className="error-message">{errors.password_confirmation}</p>}
                    {formData.password && formData.password_confirmation && formData.password !== formData.password_confirmation && (
                        <p className="error-message">Passwords do not match.</p>
                    )}
                </div>

                <div className="form-group">
                    <label>Bio:</label>
                    <textarea name="bio" value={formData.bio} onChange={handleChange} />
                </div>

                <button className="profile-button" type="submit" disabled={!passwordValid}>Update Profile</button>

                {!errors.username && !errors.email && !errors.password && !errors.password_confirmation && errors.general && (
                    <p className="error-message">{errors.general}</p>
                )}
                {errors.message && !errors.password && !errors.username && !errors.email && !errors.password_confirmation && (
                    <p className="error-message">{errors.message}</p>
                )}
            </form>
        </div>
    );
}