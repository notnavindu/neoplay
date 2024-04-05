import { writable } from 'svelte/store';

export const currentTrack = writable<Spotify.Track | null>(null);
