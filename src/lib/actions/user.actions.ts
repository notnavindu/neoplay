import api from '$lib/utils/api.util';

export const getUserProfile = async () => {
	return await api.get('/me').then((res) => res.data);
};
