import axios from "axios";

// Create an Axios instance with base URL for API requests
export const API = axios.create({
   baseURL: import.meta.env.VITE_API_URL + "/api"
});