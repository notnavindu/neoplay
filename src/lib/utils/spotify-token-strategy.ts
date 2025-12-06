import { storageKeys } from '$lib/constants/storage.const';
import type { AccessToken } from '@spotify/web-api-ts-sdk';
import axios from 'axios';

/**
 * IAuthStrategy interface from Spotify SDK
 */
interface IAuthStrategy {
	setConfiguration(configuration: unknown): void;
	getOrCreateAccessToken(): Promise<AccessToken>;
	getAccessToken(): Promise<AccessToken | null>;
	removeAccessToken(): void;
}

/**
 * Custom auth strategy that handles token storage and refresh.
 * This keeps the SDK instance stable while allowing token updates internally.
 */
export class SpotifyAuthStrategy implements IAuthStrategy {
	private clientId: string;
	private currentToken: AccessToken | null = null;

	constructor(clientId: string, initialToken?: SpotifyAccessTokenResponse | AccessToken) {
		this.clientId = clientId;
		if (initialToken) {
			// Handle both AccessToken (has `expires`) and SpotifyAccessTokenResponse formats
			if ('expires' in initialToken && initialToken.expires) {
				this.currentToken = initialToken as AccessToken;
			} else {
				this.currentToken = this.convertToAccessToken(initialToken as SpotifyAccessTokenResponse);
			}
		}
	}

	/**
	 * Set SDK configuration (called by SDK internally)
	 */
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	setConfiguration(_configuration: unknown): void {
		// Configuration is set by SDK but not needed for our implementation
	}

	/**
	 * Convert Spotify API response to SDK AccessToken format
	 */
	private convertToAccessToken(response: SpotifyAccessTokenResponse): AccessToken {
		return {
			access_token: response.access_token,
			token_type: response.token_type,
			expires_in: response.expires_in,
			refresh_token: response.refresh_token,
			// Calculate actual expiry timestamp
			expires: Date.now() + response.expires_in * 1000
		};
	}

	/**
	 * Get the current access token, refreshing if expired or about to expire
	 */
	async getAccessToken(): Promise<AccessToken | null> {
		if (!this.currentToken) {
			// Try to load from localStorage
			const stored = this.loadFromStorage();
			if (stored) {
				this.currentToken = stored;
			} else {
				return null;
			}
		}

		// Check if token is expired or will expire in the next 5 minutes
		const expiresAt = this.currentToken.expires ?? 0;
		const bufferMs = 5 * 60 * 1000; // 5 minutes buffer

		if (Date.now() + bufferMs >= expiresAt) {
			console.log('[TokenStrategy] Token expired or expiring soon, refreshing...');
			try {
				await this.refreshToken();
			} catch (error) {
				console.error('[TokenStrategy] Failed to refresh token:', error);
				return null;
			}
		}

		return this.currentToken;
	}

	/**
	 * Get or create an access token (required by SDK interface)
	 */
	async getOrCreateAccessToken(): Promise<AccessToken> {
		const token = await this.getAccessToken();
		if (!token) {
			throw new Error('No access token available. User must re-authenticate.');
		}
		return token;
	}

	/**
	 * Set a new access token (e.g., after initial OAuth)
	 */
	setAccessToken(token: AccessToken): void {
		this.currentToken = token;
		this.saveToStorage(token);
	}

	/**
	 * Set token from Spotify API response format
	 */
	setAccessTokenFromResponse(response: SpotifyAccessTokenResponse): void {
		const token = this.convertToAccessToken(response);
		this.setAccessToken(token);
	}

	/**
	 * Remove the access token (logout)
	 */
	removeAccessToken(): void {
		this.currentToken = null;
		localStorage.removeItem(storageKeys.accessToken);
	}

	/**
	 * Refresh the access token using the refresh_token
	 */
	private async refreshToken(): Promise<void> {
		if (!this.currentToken?.refresh_token) {
			throw new Error('No refresh token available');
		}

		const params = new URLSearchParams({
			grant_type: 'refresh_token',
			client_id: this.clientId,
			refresh_token: this.currentToken.refresh_token
		});

		const response = await axios
			.post('https://accounts.spotify.com/api/token', params)
			.then((res) => res.data as SpotifyAccessTokenResponse);

		// Spotify may not return a new refresh_token, preserve the old one
		if (!response.refresh_token) {
			response.refresh_token = this.currentToken.refresh_token;
		}

		const newToken = this.convertToAccessToken(response);
		this.currentToken = newToken;
		this.saveToStorage(newToken);

		console.log('[TokenStrategy] Token refreshed successfully');
	}

	/**
	 * Load token from localStorage.
	 * Handles both AccessToken format (with `expires`) and legacy SpotifyAccessTokenResponse format.
	 */
	private loadFromStorage(): AccessToken | null {
		try {
			const raw = localStorage.getItem(storageKeys.accessToken);
			if (!raw) return null;

			const parsed = JSON.parse(raw);

			// If it already has `expires`, it's in AccessToken format
			if (parsed.expires) {
				return parsed as AccessToken;
			}

			// Otherwise convert from SpotifyAccessTokenResponse format
			return this.convertToAccessToken(parsed as SpotifyAccessTokenResponse);
		} catch {
			return null;
		}
	}

	/**
	 * Save token to localStorage
	 */
	private saveToStorage(token: AccessToken): void {
		localStorage.setItem(storageKeys.accessToken, JSON.stringify(token));
	}

	/**
	 * Force a token refresh (called by auto-refresher)
	 */
	async forceRefresh(): Promise<void> {
		if (!this.currentToken) {
			const stored = this.loadFromStorage();
			if (stored) {
				this.currentToken = stored;
			} else {
				throw new Error('No token to refresh');
			}
		}
		await this.refreshToken();
	}
}

// Singleton instance for the auth strategy
let authStrategyInstance: SpotifyAuthStrategy | null = null;

/**
 * Get or create the auth strategy instance
 */
export function getAuthStrategy(
	clientId?: string,
	initialToken?: SpotifyAccessTokenResponse | AccessToken
): SpotifyAuthStrategy | null {
	if (!authStrategyInstance && clientId) {
		authStrategyInstance = new SpotifyAuthStrategy(clientId, initialToken);
	}
	return authStrategyInstance;
}

/**
 * Create a new auth strategy instance (used after login)
 */
export function createAuthStrategy(
	clientId: string,
	initialToken?: SpotifyAccessTokenResponse | AccessToken
): SpotifyAuthStrategy {
	authStrategyInstance = new SpotifyAuthStrategy(clientId, initialToken);
	return authStrategyInstance;
}

/**
 * Clear the auth strategy instance (used on logout)
 */
export function clearAuthStrategy(): void {
	if (authStrategyInstance) {
		authStrategyInstance.removeAccessToken();
	}
	authStrategyInstance = null;
}
