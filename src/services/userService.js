import axios from "axios";
import { setToken } from "../utils/auth";
import { getToken } from "../utils/auth";

const BASE_URL = 'http://127.0.0.1:8000/auth';

export const signup = async (formData) => {
    try {
        const res = await axios.post(`${BASE_URL}/signup/`, formData);
        return res.data;
    } catch (error) {
        console.error("Signup error:", error);
        throw error;
    }
};

export const login = async (formData) => {
    try {
        const res = await axios.post(`${BASE_URL}/login/`, formData);
        const { token } = res.data;

        setToken(token); 

        return res.data;
    } catch (error) {
        console.error("Login error:", error);
        throw error;
    }
};


export const profile = async (formData) => {
    const token = getToken();  

    try {
        const res = await axios.put(`${BASE_URL}/profile/`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,  
            },
        });
        return res.data;
    } catch (error) {
        console.error("Profile update error:", error);
        throw error;
    }
};




