import React, { useEffect, useMemo, useState } from 'react';
import {
	ActivityIndicator,
	Animated,
	Platform,
	StatusBar,
	Text,
	ToastAndroid,
	TouchableWithoutFeedback,
	View,
} from 'react-native';

import styles, { getColorPalette } from './styles';

interface Props {
	visible: boolean;

	theme?: 'dark' | 'light';
	accentColor?: string;
	size: 'small' | 'large';

	text?: string;
	textStyle?: any;

	cancellable?: boolean;
	onCancelTouched?: () => void;
	touchToCancelText?: string;

	onDismiss?: () => void;
}

const ProgressOverlay = (props: Props) => {
	const {
		theme,
		accentColor,
		size,
		cancellable,
		text,
		textStyle,
		onCancelTouched,
		touchToCancelText,
		onDismiss,
	} = props;

	const [visible, setVisible] = useState(props.visible);
	const [inserted, setInserted] = useState(props.visible);

	const [lastPress, setLastPress] = useState<number | undefined>(undefined);

	const animation = useMemo(
		() => new Animated.Value(props.visible ? 1 : 0),
		[],
	);

	useEffect(() => {
		props.visible ? setVisible(true) : setInserted(false);
	}, [props.visible]);

	useEffect(() => {
		if (visible) setInserted(true);
	}, [visible]);

	useEffect(() => {
		if (inserted) {
			Animated.timing(animation, {
				toValue: 1,
				duration: 250,
				useNativeDriver: true,
			}).start();
		} else {
			Animated.timing(animation, {
				toValue: 0,
				duration: 250,
				useNativeDriver: true,
			}).start(() => {
				setVisible(false);
				onDismiss && onDismiss();
			});
		}
	}, [inserted]);

	const onCancelTouch = () => {
		if (!cancellable || !onCancelTouched) return;

		const currentDate = Date.now();
		if (!lastPress || currentDate - lastPress > 300) {
			setLastPress(currentDate);
			if (Platform.OS === 'android')
				ToastAndroid.show(touchToCancelText!, ToastAndroid.SHORT);
		} else {
			setLastPress(undefined);
			onCancelTouched();
		}
	};

	const colorPalette = getColorPalette(theme!, accentColor!);

	const renderIndicator = () => (
		<ActivityIndicator
			color={colorPalette.progress}
			size={size}
			style={styles.activityIndicator}
		/>
	);

	const renderText = () => {
		if (!text) return;
		return (
			<Text style={[styles.text(colorPalette.text), textStyle]}>{text}</Text>
		);
	};

	if (!visible) return <View />;
	return (
		<>
			<StatusBar
				networkActivityIndicatorVisible
				animated
				barStyle='light-content'
			/>
			<TouchableWithoutFeedback onPress={onCancelTouch}>
				<Animated.View style={[styles.container, { opacity: animation }]}>
					<View style={styles.overlay(colorPalette.background, !!text)}>
						{renderIndicator()}
						{renderText()}
					</View>
				</Animated.View>
			</TouchableWithoutFeedback>
		</>
	);
};

ProgressOverlay.defaultProps = {
	visible: true,

	theme: 'light',
	accentColor: Platform.OS === 'ios' ? '#007aff' : '#6200ee',
	size: 'large',

	cancellable: false,
	touchToCancelText: 'Touch again to cancel operation...',
};

export default ProgressOverlay;
