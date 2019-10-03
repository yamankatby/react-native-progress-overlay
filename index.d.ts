import React from 'react';
import { Animated } from 'react-native';

export interface ProgressOverlayProps {
	visible: boolean;

	theme?: 'dark' | 'light';
	accentColor?: string;
	size: 'small' | 'large';

	text?: string;
	textStyle?: any;

	cancellable?: boolean;
	onCancelTouched?: () => void;
	touchToCancelText?: string;

	onDismiss?: () => void | false;
}

export interface ProgressOverlayState {
	fadeAnimation: Animated.Value;
	isAnimating: boolean;
	previousText?: string;

	willCancel: boolean;
}

export default class ProgressOverlay extends React.Component<ProgressOverlayProps, ProgressOverlayState> {
}

export { ProgressOverlay };
