import React from 'react';
import {
	ActivityIndicator,
	Animated,
	BackHandler,
	Platform,
	StatusBar,
	Text,
	ToastAndroid,
	TouchableWithoutFeedback,
	View,
} from 'react-native';
import { BlurView } from '@react-native-community/blur';
import Timer from 'react-native-timer';

import styles, { getColorPalette } from './styles';

class ProgressOverlay extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			fadeAnimation: new Animated.Value(0),
			isAnimating: false,
			previousText: undefined,

			willCancel: false,
		};
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		const { visible, text, onDismiss } = this.props;
		const { fadeAnimation } = this.state;

		if (!visible && nextProps.visible) {
			BackHandler.addEventListener('hardwareBackPress', this.onAndroidBackTouched);

			const animation = Animated.timing(fadeAnimation, {
				toValue: 1,
				duration: 250,
				useNativeDriver: true,
			});
			animation.stop();
			animation.start();
		}

		if (visible && !nextProps.visible) {
			BackHandler.removeEventListener('hardwareBackPress', this.onAndroidBackTouched);
			Timer.clearTimeout(this);
			this.setState(
				{
					isAnimating: true,
					...(nextProps.text ? {} : {
						previousText: text,
					}),

					willCancel: false,
				});

			Animated.timing(fadeAnimation, {
				toValue: 0,
				duration: 250,
				delay: 300,
				useNativeDriver: true,
			}).start(() => {
				if (onDismiss) onDismiss();
				this.setState({ isAnimating: false, previousText: '' });
			});
		}
	}

	onAndroidBackTouched = () => {
		this.onCancelTouched();
		return true;
	};

	onCancelTouched = () => {
		const { cancellable, onCancelTouched, touchToCancelText = 'Touch again to cancel operation...' } = this.props;
		if (!cancellable || !onCancelTouched) return;

		const { willCancel } = this.state;

		if (willCancel) {
			onCancelTouched();
		} else {
			this.setState({ willCancel: true });
			if (Platform.OS === 'android') ToastAndroid.show(touchToCancelText, ToastAndroid.SHORT);
			Timer.setTimeout(this, 'dismissMsg', () => this.setState({ willCancel: false }), 2000);
		}
	};

	render() {
		const { visible, theme, accentColor, size, text, textStyle } = this.props;
		const { fadeAnimation, isAnimating, previousText } = this.state;
		const textDisplay = text || previousText;

		if (!visible && !isAnimating) {
			return <View style={styles.noContainer} />;
		}

		const colorPalette = getColorPalette(theme, accentColor);

		const getIndicator = () =>
			<ActivityIndicator color={colorPalette.progress} size={size} style={styles.activityIndicator} />;

		const getText = () => {
			if (!textDisplay) return;
			return <Text style={[styles.text(colorPalette.text), textStyle]}>{textDisplay}</Text>;
		};

		const Overlay = Platform.OS === 'ios' ? BlurView : View;
		const overlayProps = Platform.select({
			ios: { blurType: theme, blurAmount: 10 },
			android: {},
		});

		return (
			<>
				<StatusBar networkActivityIndicatorVisible animated barStyle='light-content' />
				<TouchableWithoutFeedback onPress={this.onCancelTouched}>
					<Animated.View style={styles.container(fadeAnimation)}>
						<Overlay {...overlayProps} style={styles.overlay(colorPalette.background, !!textDisplay)}>
							{getIndicator()}
							{getText()}
						</Overlay>
					</Animated.View>
				</TouchableWithoutFeedback>
			</>
		);
	}
}

ProgressOverlay.defaultProps = {
	visible: true,

	theme: 'light',
	accentColor: Platform.OS === 'ios' ? '#007AFF' : '#6200EE',

	type: 'ios',
	size: 'small',
	cancellable: false,
};

export default ProgressOverlay;
