import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

export const predictCrop = async (data) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/predict/crop`, data);
        return response.data;
    } catch (error) {
        throw error.response?.data || { detail: "Network error connecting to AI Server" };
    }
};

export const predictDisease = async (file) => {
    try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await axios.post(`${API_BASE_URL}/predict/disease`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || { detail: "Network error connecting to AI Server" };
    }
};

export const predictFertilizer = async (data) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/predict/fertilizer`, data);
        return response.data;
    } catch (error) {
        throw error.response?.data || { detail: "Network error connecting to AI Server" };
    }
};
