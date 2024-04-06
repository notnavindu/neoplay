import { storageKeys } from '$lib/constants/storage.const';
import axios from 'axios';

export const getAccessToken = async (client_id: string, code: string, code_verifier: string) => {
	const params = new URLSearchParams({
		grant_type: 'authorization_code',
		client_id,
		code,
		code_verifier,
		redirect_uri: 'http://localhost:5177/callback'
	});

	return await axios
		.post('https://accounts.spotify.com/api/token', params)
		.then((res) => res.data as SpotifyAccessTokenResponse);
};

export const saveSpotifyAccessTokenResponse = (token: SpotifyAccessTokenResponse) => {
	localStorage.setItem(storageKeys.accessToken, JSON.stringify(token));
};

export const refreshAccessToken = async (client_id: string, refresh_token: string) => {
	const params = new URLSearchParams({
		grant_type: 'refresh_token',
		client_id,
		refresh_token
	});

	return await axios
		.post('https://accounts.spotify.com/api/token', params)
		.then((res) => res.data as SpotifyAccessTokenResponse);
};

export const getSavedAccessToken = () => {
	const accessTokenRaw = localStorage.getItem(storageKeys.accessToken) as string;
	console.log('🚀 ~ getSavedAccessToken ~ accessTokenRaw:', accessTokenRaw);
	const clientId = localStorage.getItem(storageKeys.clientId) as string;
	console.log('🚀 ~ getSavedAccessToken ~ clientId:', clientId);

	if (!accessTokenRaw || !clientId) return { accessToken: null, clientId: null };

	const accessTokenParsed = JSON.parse(accessTokenRaw) as SpotifyAccessTokenResponse;
	console.log('🚀 ~ getSavedAccessToken ~ accessTokenParsed:', accessTokenParsed);
	return { accessToken: accessTokenParsed, clientId };
};
