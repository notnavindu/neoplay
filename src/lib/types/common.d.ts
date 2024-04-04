interface CliCommand {
	text: string;
}

interface OnboardingStep {
	component: typeof SvelteComponent;
}

interface OnboardingStepDispatcher {
	stepComplete: void;
	pushToStack: CliCommand;
}
