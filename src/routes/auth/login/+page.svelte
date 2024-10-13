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

<div class="p-4 flex flex-col text-sm w-full items-center justify-center">
	<div class="w-full max-w-sm border border-blue-500 p-3 flex flex-col gap-4">
		<div class="text-blue-500">LOGIN</div>

		<div class="flex items-center gap-2">
			<input
				class="text-white p-1 w-full max-w-xs border-b border-blue-500 bg-black outline-none"
				bind:value={clientId}
				placeholder="CLIENT ID"
				type="text"
			/>

			<a
				class="p-1"
				target="_blank"
				href="https://github.com/notnavindu/neoplay?tab=readme-ov-file#spotify-account-setup">?</a
			>
		</div>

		<button class="w-fit mt-3 text-white bg-blue-500 py-1 px-2" on:click={handleAuthenticatePress}
			>Authenticate</button
		>
	</div>
</div>
