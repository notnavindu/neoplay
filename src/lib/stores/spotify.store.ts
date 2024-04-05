import { writable } from 'svelte/store';
import type { SpotifyApi } from '@spotify/web-api-ts-sdk';

export const spotifySdk = writable<SpotifyApi | null>(null);
export const spotifyPlayer = writable<Spotify.Player | null>(null);
export const spotifyPlayerReady = writable<boolean>(false);

export const spotifyPlaybackState = writable<Spotify.PlaybackState | null>(null);
