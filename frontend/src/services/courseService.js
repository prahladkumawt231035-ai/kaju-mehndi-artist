import API from "../api/axios";

export const getAllCourses = async () => {
    const { data } = await API.get("/courses");
    return data;
};

export const getCourseById = async (id) => {
    const { data } = await API.get(`/courses/${id}`);
    return data;
};
