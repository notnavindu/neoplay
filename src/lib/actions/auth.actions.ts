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
