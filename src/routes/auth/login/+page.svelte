<script lang="ts">
	import { storageKeys } from '$lib/constants/storage.const';
	import {
		base64encode,
		generateRandomString,
		getAuthorizeUrl,
		sha256
	} from '$lib/utils/auth.utils';
	import { open } from '@tauri-apps/plugin-shell';

	let clientId = localStorage.getItem(storageKeys.clientId)!;
	let authUrl: string;
	let codeVerifier: string;
	let state: string;
	let hashed: ArrayBuffer;
	let codeChallenge: string;

	const handleAuthenticatePress = async () => {
		codeVerifier = generateRandomString(64);
		state = generateRandomString(6);
		hashed = await sha256(codeVerifier);
		codeChallenge = base64encode(hashed);

		authUrl = getAuthorizeUrl(clientId, codeChallenge, state);

		localStorage.setItem(storageKeys.state, state);
		localStorage.setItem(storageKeys.clientId, clientId);
		localStorage.setItem(storageKeys.codeVerifier, codeVerifier);

		open(authUrl);
	};
</script>

<div class="p-4 flex flex-col text-sm w-full">
	<label>
		Client ID
		<input class="text-black" bind:value={clientId} type="text" />
	</label>

	<br />

	<label>
		Client Secret
		<input type="text" />
	</label>

	<button class="w-fit mt-3 text-blue-500" on:click={handleAuthenticatePress}>Authenticate</button>
</div>
