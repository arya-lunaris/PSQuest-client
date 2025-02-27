import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";
import { profile } from "../../services/userService"; 
import styles from "./profile.module.css";

export default function UpdateProfile() {
    const { user } = useContext(UserContext);
    const { userId } = useParams(); 
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        password_confirmation: ""
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        console.log("User data in useEffect:", user); 

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
            password: "",
            password_confirmation: ""
        });

        console.log("Setting form data with user data:", {
            username: user.username || "",
            email: user.email || "" 
        });

    }, [user, userId, navigate]);

    const handleChange = (event) => {
        console.log(`Field ${event.target.name} changed to:`, event.target.value);
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        console.log("Form data being submitted:", formData);

        if (formData.password && formData.password !== formData.password_confirmation) {
            setErrors({ password_confirmation: "Passwords do not match" });
            return;
        }

        const updatedFormData = { ...formData };
        
        if (!formData.password) {
            delete updatedFormData.password;
            delete updatedFormData.password_confirmation;
        }

        console.log("User token in profile update:", user.token);

        try {
            await profile(updatedFormData, user.token);
            navigate("/collection"); 
        } catch (error) {
            console.log("Error while updating profile:", error);
            setErrors({ general: error.response?.data?.message || "Failed to update profile." });
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Update Your Profile</h1>
            {errors.general && <p className={styles.error}>{errors.general}</p>}
            {errors.message && <p className={styles.error}>{errors.message}</p>}

            <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <label>Username:</label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <label>New Password:</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label>Confirm Password:</label>
                    <input
                        type="password"
                        name="password_confirmation"
                        value={formData.password_confirmation}
                        onChange={handleChange}
                    />
                </div>

                <button className={styles.button} type="submit">Update Profile</button>
            </form>
        </div>
    );
}
