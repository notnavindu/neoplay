import {
	SpotifyAuthStrategy,
	clearAuthStrategy,
	createAuthStrategy,
	getAuthStrategy
} from '$lib/utils/spotify-token-strategy';
import { SpotifyApi, type AccessToken } from '@spotify/web-api-ts-sdk';
import { get, writable } from 'svelte/store';

export const spotifySdk = writable<SpotifyApi | null>(null);
export const spotifyPlayer = writable<Spotify.Player | null>(null);
export const spotifyPlayerReady = writable<boolean>(false);

export const spotifyPlaybackState = writable<Spotify.PlaybackState | null>(null);
export const spotifyDeviceId = writable<string | null>(null);

/**
 * Create or get the Spotify SDK instance with the auth strategy.
 * This ensures only one SDK instance exists throughout the app lifecycle.
 */
export function initializeSpotifySdk(
	clientId: string,
	initialToken?: SpotifyAccessTokenResponse | AccessToken
): SpotifyApi {
	// Create the auth strategy
	const authStrategy = createAuthStrategy(clientId, initialToken);

	// Create SDK with our custom auth strategy
	const sdk = new SpotifyApi(authStrategy);

	// Update the store
	spotifySdk.set(sdk);

	return sdk;
}

/**
 * Get the current auth strategy instance
 */
export function getSpotifyAuthStrategy(): SpotifyAuthStrategy | null {
	return getAuthStrategy();
}

/**
 * Clear the SDK and auth strategy (used on logout)
 */
export function clearSpotifySdk(): void {
	const currentSdk = get(spotifySdk);
	if (currentSdk) {
		// SDK doesn't have a dispose method, just clear references
	}
	spotifySdk.set(null);
	spotifyPlayer.set(null);
	spotifyPlayerReady.set(false);
	spotifyPlaybackState.set(null);
	spotifyDeviceId.set(null);
	clearAuthStrategy();
}

/**
 * Get access token from the current auth strategy
 */
export async function getAccessTokenFromStrategy(): Promise<AccessToken | null> {
	const strategy = getAuthStrategy();
	if (!strategy) return null;
	return strategy.getAccessToken();
}
