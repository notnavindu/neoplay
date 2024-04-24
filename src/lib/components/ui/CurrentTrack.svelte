<script>
	import { page } from '$app/stores';
	import { spotifySdk } from '$lib/stores/spotify.store';
	import { currentTrack } from '$lib/stores/track.store';
	import { msToMinutesSeconds } from '$lib/utils/time.utils';
	import { expoInOut } from 'svelte/easing';
	import { fly, slide } from 'svelte/transition';
	import PlaybackControls from './PlaybackControls.svelte';
	import TrackAttribute from './TrackAttribute.svelte';

	$: expanded = $page.route.id === '/main';
</script>

{#if !$currentTrack}
	<div>No Track</div>
{:else}
	{#key $currentTrack.id}
		<div class="flex gap-8 flex-col md:flex-row">
			<div
				class="transition-all duration-500 ease-in-out"
				class:size-64={expanded}
				class:size-32={!expanded}
			>
				<div class="bg-white/5" in:fly={{ y: 30, easing: expoInOut }}>
					<img src={$currentTrack?.album.images[0].url} alt="Album art for {$currentTrack?.name}" />
				</div>
			</div>

			<div class="">
				<div in:fly={{ y: 30, delay: 50, easing: expoInOut }}>
					<div class="text-white/70">// NOW PLAYING</div>
					{#if expanded}
						<div transition:slide class="text-white/70">---------------</div>
					{/if}
				</div>

				<div class="mt-2" in:fly={{ y: 30, delay: 100, easing: expoInOut }}>
					<TrackAttribute key="Song" value={$currentTrack.name} />
					<TrackAttribute
						key="Artist(s)"
						value={$currentTrack.artists.map((artist) => artist.name).join(', ')}
					/>
					<TrackAttribute key="Duration" value={msToMinutesSeconds($currentTrack.duration_ms)} />
					<TrackAttribute key="Album" value={$currentTrack.album.name} />

					<!-- Svelte Type Error if you remove this -->
					{#if $currentTrack.id && expanded}
						<div class="h-32" transition:slide={{ axis: 'y' }}>
							<!-- TODO: Move to tan stack query -->
							{#await $spotifySdk?.tracks.audioFeatures($currentTrack.id)}
								{#each { length: 8 } as _}
									<div class="w-full h-4 shimmer-bg rounded-full"></div>
								{/each}
							{:then features}
								<div in:fly={{ y: 10 }}>
									<TrackAttribute key="Acousticness" value={features?.acousticness} />
									<TrackAttribute key="Danceability" value={features?.danceability} />
									<TrackAttribute key="Energy" value={features?.energy} />
									<TrackAttribute key="Instrumentalness" value={features?.instrumentalness} />
									<TrackAttribute key="Liveness" value={features?.liveness} />
									<TrackAttribute key="Loudness" value={features?.loudness} />
									<TrackAttribute key="Speechiness" value={features?.speechiness} />
									<TrackAttribute key="Valence" value={features?.valence} />
								</div>
							{/await}
						</div>
					{/if}
				</div>

				<PlaybackControls />
			</div>
		</div>
	{/key}
{/if}
