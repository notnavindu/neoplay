<script>
	import Sidebar from '$lib/components/common/sidebar.svelte';
	import '@fontsource/geist-mono/400.css';
	import '@fontsource/geist-mono/500.css';
	import '@fontsource/geist-mono/600.css';
	import '@fontsource/geist-mono/700.css';
	import '../app.css';
	import { auth } from '$lib/stores/auth.store';
	import { goto } from '$app/navigation';
	import { storageKeys } from '$lib/constants/storage.const';
	import dayjs from 'dayjs';
	import { onMount } from 'svelte';

	onMount(() => {
		const accessToken = localStorage.getItem(storageKeys.accessToken);
		const refreshToken = localStorage.getItem(storageKeys.refreshToken);
		const expiresAt = localStorage.getItem(storageKeys.expiresAt);

		if (accessToken && refreshToken && expiresAt) {
			const expiresAtParsed = dayjs(expiresAt);

			if (expiresAtParsed.isBefore(dayjs())) {
				console.log('NEEDS TO REFRESH HERE');
				auth.logout();
			} else {
				auth.login(accessToken, refreshToken, expiresAtParsed.toDate());
			}
		}
	});

	$: if ($auth.isLoggedIn) goto('/main');
</script>

<main class="bg-neo-black w-full min-h-screen text-white flex text-xs">
	<slot />
</main>
