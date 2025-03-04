import axios from "axios";
import { getToken } from "../utils/auth";

const BASE_URL = 'http://127.0.0.1:8000/user-games'

export const saveGameFromIGDB = async (gameData) => {
    try {
        const res = await axios.post(`${BASE_URL}/save-game/`, gameData, {
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        });
        return res.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const getUserGamesByStatus = async (status) => {
    try {
        const response = await axios.get(`${BASE_URL}/status/${status}/`, {
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching user games by status:", error);
        throw error;
    }
};

export const removeGameFromUser = async (gameId) => {
    try {
        const response = await axios.delete(`${BASE_URL}/${gameId}/`, {
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Failed to remove game:", error);
        throw error;
    }
};

export const getFullUserGame = async (usergameId) => {
    const token = localStorage.getItem("gsky_token");
  
    if (!token) {
      throw new Error("No token found in localStorage");
    }
  
    try {
      const response = await axios.get(`${BASE_URL}/${usergameId}/full/`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
  
      return response.data; 
    } catch (error) {
      throw new Error("Failed to fetch game details: " + error.message);
    }
  };

  export const updateUserGame = async (usergameId, updatedData) => {
    const token = localStorage.getItem("gsky_token");
  
    if (!token) {
      throw new Error("No token found in localStorage");
    }
  
    try {
      const response = await axios.put(`${BASE_URL}/${usergameId}/`, updatedData, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
  
      return response.data;  
    } catch (error) {
      throw new Error("Failed to update game details: " + error.message);
    }
  };
  
