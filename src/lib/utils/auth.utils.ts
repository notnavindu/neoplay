import { scopes } from '$lib/constants/auth.const';

export const generateRandomString = (length: number) => {
	let text = '';
	let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

	for (let i = 0; i < length; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
};

export const getAuthorizeUrl = (clientId: string, state: string) => {
	let auth_query_parameters = new URLSearchParams({
		response_type: 'code',
		client_id: clientId,
		scope: scopes,
		redirect_uri: 'http://localhost/callback',
		state: state
	});

	return 'https://accounts.spotify.com/authorize/?' + auth_query_parameters.toString();
};
