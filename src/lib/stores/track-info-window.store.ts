import type { Track } from '@spotify/web-api-ts-sdk';
import { writable } from 'svelte/store';

type TrackInfoWindowOptions = {
	source: 'trigger' | 'overlay' | null;
	debounceTimer?: number | null;
	triggeredTrackId: string | null;
	track: Track | null;
	x: number;
	y: number;
};

const createTrackInfoWindowStore = () => {
	const { subscribe, set, update } = writable<TrackInfoWindowOptions>({
		source: null,
		track: null,
		debounceTimer: null,
		triggeredTrackId: null,
		x: 0,
		y: 0
	});

	return {
		subscribe,
		open: (options: TrackInfoWindowOptions) => {
			set(options);
		},

		keepOpen: () => {
			update((state) => {
				if (state.debounceTimer) {
					clearTimeout(state.debounceTimer);
				}

				return {
					...state,
					debounceTimer: null
				};
			});
		},

		close: (trackId?: string) => {
			update((state) => {
				let debounceTimer = setTimeout(() => {
					update((update) => {
						if (update.triggeredTrackId === trackId) {
							return {
								source: null,
								track: null,
								debounceTimer: null,
								triggeredTrackId: null,
								x: 0,
								y: 0
							};
						}

						return update;
					});
				}, 300);

				return {
					...state,
					debounceTimer: debounceTimer
				};
			});
		},
		update
	};
};

export const trackInfoWindow = createTrackInfoWindowStore();
