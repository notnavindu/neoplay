import type { SpotifyApi } from '@spotify/web-api-ts-sdk';
import { writable } from 'svelte/store';

export const spotifySdk = writable<SpotifyApi | null>(null);
export const spotifyPlayer = writable<Spotify.Player | null>(null);
export const spotifyPlayerReady = writable<boolean>(false);

export const spotifyPlaybackState = writable<Spotify.PlaybackState | null>(null);
export const spotifyDeviceId = writable<string | null>(null);
