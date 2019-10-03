import { Dimensions, Platform, StyleSheet } from 'react-native';

const getOverlayWidth = () => {
	let reVal = 320;
	const screenWidth = Dimensions.get('window').width - 52;

	if (reVal > screenWidth) {
		reVal = screenWidth;
	}
	return reVal;
};

export default StyleSheet.create({
	// @ts-ignore
	container: (opacity: number) => ({
		position: 'absolute',
		top: 0,
		bottom: 0,
		left: 0,
		right: 0,

		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',

		backgroundColor: Platform.OS === 'ios' ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.6)',
		opacity,
	}),

	activityIndicator: {
		justifyContent: 'center',
		alignItems: 'center',

		margin: 10,
	},

	noContainer: {
		position: 'absolute',
		top: 0,
		left: 0,
		width: 0.001,
		height: 0.001,
	},

	// @ts-ignore
	overlay: (background: string, hasText: boolean) => ({
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
		...(hasText ? { width: getOverlayWidth() } : {}),

		paddingHorizontal: hasText ? 14 : 20,
		paddingVertical: 20,

		...Platform.select({
			ios: {
				borderRadius: 18,
				backgroundColor: 'rgba(255,255,255,0.6)',

				marginBottom: 20,
			},
			android: {
				borderRadius: 4,
				backgroundColor: background,
				elevation: 14,
			},
		}),
	}),

	// @ts-ignore
	text: (textColor: string) => ({
		flex: 1,

		marginStart: 12,
		fontSize: Platform.OS === 'ios' ? 16 : 14,

		color: textColor,
	}),
});
