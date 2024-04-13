<script>
	import { goto } from '$app/navigation';
	import TokenAutoRefresher from '$lib/components/auth/TokenAutoRefresher.svelte';
	import Sidebar from '$lib/components/common/sidebar.svelte';
	import BottomBar from '$lib/components/layout/BottomBar.svelte';
	import WebPlayerListener from '$lib/components/listeners/WebPlayerListener.svelte';
	import CurrentTrack from '$lib/components/ui/CurrentTrack.svelte';
	import { auth } from '$lib/stores/auth.store';
	import { spotifyPlayerReady } from '$lib/stores/spotify.store';
	import { currentTrack } from '$lib/stores/track.store';
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

	{#if !$leftSidebarOpen}
		<button
			class="absolute top-[6px] bg-neo-blue z-40 h-fit px-2 py-1 leading-1"
			on:click={() => ($leftSidebarOpen = !$leftSidebarOpen)}
		>
			→
		</button>
	{/if}

	<div class="w-full flex flex-col justify-between relative">
		<div class="p-4 relative h-full">
			{#if $currentTrack}
				<CurrentTrack />
			{/if}

			<slot />
		</div>

		<BottomBar />
	</div>
{:else}
	<div>Loading</div>
{/if}
