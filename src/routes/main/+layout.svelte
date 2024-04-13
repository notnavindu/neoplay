<script>
	import { goto } from '$app/navigation';
	import TokenAutoRefresher from '$lib/components/auth/TokenAutoRefresher.svelte';
	import Sidebar from '$lib/components/common/sidebar.svelte';
	import BottomBar from '$lib/components/layout/BottomBar.svelte';
	import WebPlayerListener from '$lib/components/listeners/WebPlayerListener.svelte';
	import { auth } from '$lib/stores/auth.store';
	import { spotifyPlayerReady } from '$lib/stores/spotify.store';
	import { leftSidebarOpen } from '$lib/stores/ui.store';

	if (!$auth.isLoggedIn) goto('/');
</script>

<TokenAutoRefresher />
<WebPlayerListener />

{#if $spotifyPlayerReady}
	{#if $leftSidebarOpen}
		<div>
			<Sidebar />
		</div>
	{/if}

	<button
		class="absolute top-4 bg-neo-blue p-2 z-40"
		on:click={() => ($leftSidebarOpen = !$leftSidebarOpen)}>OPEN</button
	>

	<div class="w-full flex flex-col justify-between">
		<div class="p-4 relative">
			<slot />
		</div>

		<BottomBar />
	</div>
{:else}
	<div>Loading</div>
{/if}
