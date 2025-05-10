"use client";
import { useCallback, useState } from "react";

interface UseStepperProps {
	initialStep?: number;
	totalSteps: number;
}

interface UseStepperReturn {
	currentStep: number;
	isFirstStep: boolean;
	isLastStep: boolean;
	nextStep: () => void;
	previousStep: () => void;
	goToStep: (step: number) => void;
	reset: () => void;
}

export const useStepper = ({
	initialStep = 1,
	totalSteps,
}: UseStepperProps): UseStepperReturn => {
	const [currentStep, setCurrentStep] = useState(initialStep);

	const isFirstStep = currentStep === 1;
	const isLastStep = currentStep === totalSteps;

	const nextStep = useCallback(() => {
		if (currentStep < totalSteps) {
			setCurrentStep((prev) => prev + 1);
		}
	}, [currentStep, totalSteps]);

	const previousStep = useCallback(() => {
		if (currentStep > 1) {
			setCurrentStep((prev) => prev - 1);
		}
	}, [currentStep]);

	const goToStep = useCallback(
		(step: number) => {
			if (step >= 1 && step <= totalSteps) {
				setCurrentStep(step);
			}
		},
		[totalSteps],
	);

	const reset = useCallback(() => {
		setCurrentStep(initialStep);
	}, [initialStep]);

	return {
		currentStep,
		isFirstStep,
		isLastStep,
		nextStep,
		previousStep,
		goToStep,
		reset,
	};
};
