import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";
import { profile, getUserProfile } from "../../services/userService";
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

    useEffect(() => {
        if (!user) {
            navigate("/login");
            return;
        }

        if (user.id !== parseInt(userId)) {
            setErrors({ message: "You don't have permission to edit this profile." });
            return;
        }

        setFormData({
            username: user.username || "",
            email: user.email || "",
            bio: user.bio ?? "", 
            password: "",
            password_confirmation: ""
        });
    }, [user, userId, navigate]);

    const handleChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };

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
            await profile(updatedFormData);

            const updatedUser = await getUserProfile();
            setUser(updatedUser);

            navigate("/collection");
        } catch (error) {
            setErrors({ general: error.message || "Failed to update profile." });
        }
    };

    return (
        <div className="profile-container">
            <h1 className="profile-title">Update Your Profile</h1>
            {errors.general && <p className="error">{errors.general}</p>}
            {errors.message && <p className="error">{errors.message}</p>}

            <form className="profile-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Username:</label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>New Password:</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label>Confirm Password:</label>
                    <input
                        type="password"
                        name="password_confirmation"
                        value={formData.password_confirmation}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label>Bio:</label>
                    <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                    />
                </div>

                <button className="profile-button" type="submit">Update Profile</button>
            </form>
        </div>
    );
}
