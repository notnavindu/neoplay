interface CliCommand {
	text: string;
	type: 'command' | 'info' | 'error';
}

interface OnboardingStep {
	component: typeof SvelteComponent;
}

interface OnboardingStepDispatcher {
	stepComplete: void;
	pushToStack: CliCommand;
}
