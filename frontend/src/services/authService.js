import API from "../api/axios";

export const register = async (userData) => {
    const { data } = await API.post("/auth/register", userData);
    return data;
};

export const login = async (credentials) => {
    const { data } = await API.post("/auth/login", credentials);
    return data;
};

export const logout = async () => {
    const { data } = await API.post("/auth/logout");
    return data;
};

export const getMe = async () => {
    const { data } = await API.get("/auth/me");
    return data;
};
