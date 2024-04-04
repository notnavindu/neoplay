import { scopes } from '$lib/constants/auth.const';

export const generateRandomString = (length: number) => {
	const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	const values = crypto.getRandomValues(new Uint8Array(length));
	return values.reduce((acc, x) => acc + possible[x % possible.length], '');
};

export const sha256 = async (plain: string) => {
	const encoder = new TextEncoder();
	const data = encoder.encode(plain);
	return window.crypto.subtle.digest('SHA-256', data);
};

export const base64encode = (input: ArrayBuffer) => {
	return btoa(String.fromCharCode(...new Uint8Array(input)))
		.replace(/=/g, '')
		.replace(/\+/g, '-')
		.replace(/\//g, '_');
};

export const getAuthorizeUrl = (clientId: string, codeChallenge: string, state: string) => {
	let auth_query_parameters = new URLSearchParams({
		response_type: 'code',
		client_id: clientId,
		scope: scopes,
		redirect_uri: 'http://localhost:5177/callback',
		state: state,
		code_challenge_method: 'S256',
		code_challenge: codeChallenge
	});

	return 'https://accounts.spotify.com/authorize/?' + auth_query_parameters.toString();
};
