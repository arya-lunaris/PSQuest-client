import axios from "axios";
import { getToken } from "../utils/auth";

const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/game`;

export const gameIndex = async () => {
  try {
    const res = await axios.get(BASE_URL + "/index", {
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

export const gameShow = async (gameId) => {
  try {
    const res = await axios.get(BASE_URL + `/${gameId}`, {
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

export const gameCreate = async (formData) => {
  try {
    const res = await axios.post(BASE_URL, formData, {
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

export const gameUpdate = async (gameId, formData) => {
  try {
    const res = await axios.put(BASE_URL + `/${gameId}`, formData, {
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

export const gameDelete = async (gameId) => {
  try {
    const res = await axios.delete(BASE_URL + `/${gameId}`, {
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

export const gameFetchFromIGDB = async (searchTerm) => {
  try {
    const encodedSearchTerm = encodeURIComponent(searchTerm);
    const url = `${BASE_URL}/fetch-igdb-games/?search=${encodedSearchTerm}`;
    const res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    return res.data;
  } catch (error) {
    console.log("Error fetching games:", error);
    throw error;
  }
};

