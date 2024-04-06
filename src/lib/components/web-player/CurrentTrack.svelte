<script>
	import { spotifySdk } from '$lib/stores/spotify.store';
	import { currentTrack } from '$lib/stores/track.store';
	import { msToMinutesSeconds } from '$lib/utils/time.utils';
	import { fly } from 'svelte/transition';
	import PlaybackControls from './PlaybackControls.svelte';
	import TrackAttribute from './TrackAttribute.svelte';
</script>

{#if !$currentTrack}
	<div>No Track</div>
{:else}
	{#key $currentTrack.id}
		<div class="flex gap-8">
			<div class="w-64 h-64">
				<div class="bg-white/5" in:fly={{ y: 30 }}>
					<img src={$currentTrack?.album.images[0].url} alt="Album art for {$currentTrack?.name}" />
				</div>
			</div>

			<div class="">
				<div in:fly={{ y: 30, delay: 50 }}>
					<div class="text-white/70">// NOW PLAYING</div>
					<div class="text-white/70 mb-2">---------------</div>
				</div>

				<div in:fly={{ y: 30, delay: 100 }}>
					<TrackAttribute key="Song" value={$currentTrack.name} />
					<TrackAttribute
						key="Artist(s)"
						value={$currentTrack.artists.map((artist) => artist.name).join(', ')}
					/>
					<TrackAttribute key="Duration" value={msToMinutesSeconds($currentTrack.duration_ms)} />
					<TrackAttribute key="Album" value={$currentTrack.album.name} />

					<!-- Svelte Type Error if you remove this -->
					{#if $currentTrack.id}
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
					{/if}
				</div>

				<PlaybackControls />
			</div>
		</div>
	{/key}
{/if}
