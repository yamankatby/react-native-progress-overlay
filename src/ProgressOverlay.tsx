import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Animated, Platform, StatusBar, ToastAndroid, TouchableWithoutFeedback, View } from 'react-native';

import Indicator, { Props as IndicatorProps } from './Indicator';
import styles from './styles';

interface Props extends IndicatorProps {
	visible: boolean;

	cancellable?: boolean;
	onCancelPress?: () => void;
	touchToCancelText?: string;

	onDismiss?: () => void | false;
}

const ProgressOverlay = (props: Props) => {
	const {
		visible,
		cancellable,
		onCancelPress,
		touchToCancelText,
		onDismiss,
		...indicatorProps
	} = props;

	const fadeAnimation = useMemo(() => new Animated.Value(visible ? 1 : 0), []);
	const [inserted, setInserted] = useState(visible);

	useEffect(() => {
		if (visible) {
			setInserted(true);
		} else {
			animate(0, () => {
				setInserted(false);
			});
		}
	}, [visible]);

	useEffect(() => {
		if (!inserted) {
			return;
		} else {
			animate(1);
		}
	}, [inserted]);

	const animate = useCallback((toValue: 0 | 1, callback?: () => void) => {
		Animated.timing(fadeAnimation, {
			toValue,
			duration: 250,
			useNativeDriver: true,
		}).start(callback);
	}, []);

	useEffect(() => {

	}, []);

	const onCancelTouched = useCallback(() => {
		if (!cancellable || !onCancelTouched) return;
		if (Platform.OS === 'android') {
			ToastAndroid.show(touchToCancelText || 'Touch again to cancel operation...', ToastAndroid.SHORT);
		}
	}, []);

	if (!inserted) return <View />;
	return (
		<>
			<StatusBar
				networkActivityIndicatorVisible
				animated
				barStyle='light-content'
			/>
			<TouchableWithoutFeedback onPress={onCancelTouched}>
				<Animated.View style={[styles.container, { opacity: fadeAnimation }]}>
					<Indicator {...indicatorProps} />
				</Animated.View>
			</TouchableWithoutFeedback>
		</>
	);
};

ProgressOverlay.defaultProps = {
	visible: true,
};

export default ProgressOverlay;
