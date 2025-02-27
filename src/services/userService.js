import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

export const signup = async (formData) => {
    try {
        const res = await axios.post(`${BASE_URL}/signup`, formData);
        return res.data;
    } catch (error) {
        console.error("Signup error:", error);
        throw error;
    }
};

export const login = async (formData) => {
    try {
        const res = await axios.post(`${BASE_URL}/login`, formData);
        return res.data;
    } catch (error) {
        console.error("Login error:", error);
        throw error;
    }
};

export const updateProfile = async (formData, token) => {
    try {
        const res = await axios.put(`${BASE_URL}/profile`, formData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return res.data;
    } catch (error) {
        console.error("Profile update error:", error);
        throw error;
    }
};
