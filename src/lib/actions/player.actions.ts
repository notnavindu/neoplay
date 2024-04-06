import { spotifySdk } from '$lib/stores/spotify.store';
import { get } from 'svelte/store';

export const switchPlaylist = async (playlistUri: string, startUri: string) => {
	console.log('🚀 ~ switchTrack ~ uri:', playlistUri);
	const devices = await get(spotifySdk)?.player.getAvailableDevices();
	if (!devices) return;
	const activeDevice = devices.devices.find((device) => device.is_active);
	await get(spotifySdk)?.player.startResumePlayback(activeDevice?.id!, playlistUri, undefined, {
		uri: startUri
	});
};
