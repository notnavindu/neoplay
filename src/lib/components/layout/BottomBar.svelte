<script>
	import { page } from '$app/stores';
	import Seeker from '$lib/components/ui/TimeMatrix/Seeker.svelte';
	import { currentTrack } from '$lib/stores/track.store';
</script>

<div class="w-full flex-shrink-0 bg-neo-black">
	<div class="">
		{#key $currentTrack?.id}
			<Seeker />
		{/key}
	</div>
	<div class="w-full h-12 border-t border-neo-gray-1 flex items-center justify-between">
		<div class="h-full flex">
			<a
				class:bg-neo-blue={$page.route.id === '/main'}
				href="/main"
				class="w-fit px-5 h-full flex items-center border-r border-neo-blue"
			>
				Player
			</a>
			<a
				class:bg-neo-blue={$page.route.id === '/main/search'}
				href="/main/search"
				class="w-fit px-5 h-full flex items-center border-r border-neo-blue"
			>
				Search
			</a>
			<a
				class:bg-neo-blue={$page.route.id === '/main/craft'}
				href="/main/craft"
				class="w-fit px-5 h-full flex items-center border-r border-neo-blue">Craft</a
			>
		</div>
		<div class="h-fit">
			<img src="/Spotify_Logo_RGB_White.png" class="w-[83px] pr-4 h-auto" alt="spotify logo" />
		</div>
	</div>
</div>
