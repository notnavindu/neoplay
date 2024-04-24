import { writable } from 'svelte/store';

export const trackInfoWindow = writable({
	track: null,
	x: 0,
	y: 0
});
