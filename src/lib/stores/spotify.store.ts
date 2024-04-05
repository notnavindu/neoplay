import { writable } from 'svelte/store';
import type { SpotifyApi } from '@spotify/web-api-ts-sdk';

export const spotifySdk = writable<SpotifyApi | null>(null);
