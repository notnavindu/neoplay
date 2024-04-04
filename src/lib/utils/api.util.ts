import { auth } from '$lib/stores/auth.store';
import axios, { type AxiosInstance } from 'axios';
import { get } from 'svelte/store';

const axiosInstance: AxiosInstance = axios.create({
	baseURL: 'https://api.spotify.com/v1'
});
axiosInstance.interceptors.request.use(
	async (config) => {
		const token = get(auth).accessToken;

		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}

		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

export default axiosInstance;
