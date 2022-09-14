import axios from "axios";

const request = axios.create({
    withCredentials: true,
    baseURL: "http://localhost:5000/",
});

export {
    request,
}