import { storageKeys } from '$lib/constants/storage.const';
import axios from 'axios';

/**
 * Exchange authorization code for access token (initial OAuth flow)
 */
export const getAccessToken = async (client_id: string, code: string, code_verifier: string) => {
	const params = new URLSearchParams({
		grant_type: 'authorization_code',
		client_id,
		code,
		code_verifier,
		redirect_uri: 'http://127.0.0.1:3008/callback'
	});

	return await axios
		.post('https://accounts.spotify.com/api/token', params)
		.then((res) => res.data as SpotifyAccessTokenResponse);
};

/**
 * Check if there's a saved token and client ID in localStorage.
 * Returns the raw token data - the auth strategy handles format conversion.
 */
export const getSavedAccessToken = () => {
	const accessTokenRaw = localStorage.getItem(storageKeys.accessToken);
	const clientId = localStorage.getItem(storageKeys.clientId);

	if (!accessTokenRaw || !clientId) return { accessToken: null, clientId: null };

	return { accessToken: JSON.parse(accessTokenRaw), clientId };
};
