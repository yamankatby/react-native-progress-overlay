import { Platform } from 'react-native';

export const getColorPalette = (theme: 'dark' | 'light', accent: string) => {
	const light = {
		background: '#fff',
		text: Platform.OS === 'ios' ? '#3c3c3c' : '#232323',
		progress: Platform.OS === 'ios' ? '#373737' : accent,
	};
	const dark = {
		background: '#424242',
		text: Platform.OS === 'ios' ? '#c3c3c3' : '#dcdcdc',
		progress: Platform.OS === 'ios' ? '#c8c8c8' : accent,
	};

	return theme === 'dark' ? dark : light;
};
