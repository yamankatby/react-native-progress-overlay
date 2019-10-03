import React from 'react';
import { ActivityIndicator, Platform, Text, View } from 'react-native';

import { BlurView } from '@react-native-community/blur';
import { getColorPalette, indicatorStyles as styles } from './styles';

export interface Props {
	theme?: 'dark' | 'light';
	accentColor?: string;

	size?: 'small' | 'large';

	text?: string;
	textStyle?: any;
}

const Indicator = (props: Props) => {
	const { theme, accentColor, size, text, textStyle } = props;
	const palette = getColorPalette(theme!, accentColor!);

	const renderIndicator = () => (
		<ActivityIndicator
			color={palette.progress}
			size={size}
			style={styles.indicator}
		/>
	);
	const renderText = () =>
		text && <Text style={[styles.text(palette.text), textStyle]}>{text}</Text>;

	const Overlay = (Platform.OS === 'ios' ? BlurView : View) as any;
	const overlayProps = Platform.select({
		ios: { blurType: theme, blurAmount: 10 },
		android: {},
	});

	return (
		<Overlay
			{...overlayProps}
			style={styles.container(text, palette.background)}
		>
			{renderIndicator()}
			{renderText()}
		</Overlay>
	);
};

Indicator.defaultProps = {
	theme: 'light',
	accentColor: Platform.OS === 'ios' ? '#007aff' : '#6200EE',

	size: 'large',
};

export default Indicator;
