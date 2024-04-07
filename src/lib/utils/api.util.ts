import axios, { type AxiosInstance } from 'axios';

const axiosInstance: AxiosInstance = axios.create({
	baseURL: 'https://api.spotify.com/v1'
});

export default axiosInstance;
