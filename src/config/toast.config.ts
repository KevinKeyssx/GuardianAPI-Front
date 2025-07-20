import type { ToastOptions } from 'svelte-french-toast';

// Base style for dark theme only
const baseStyle = `
	background-color: #050924;
	padding: 16px;
	border: 1px solid #00f3ff20;
	border-radius: 8px;
	backdrop-filter: blur(10px);
	box-shadow: 0 4px 20px rgba(0, 243, 255, 0.1);
`;


const baseToastConfig: ToastOptions = {
	position    : "bottom-right",
	duration    : 4000,
	className   : "shadow-lg",
};

// Loading toast with neon blue accent
export const loadingToast = (): ToastOptions => {
	return {
		...baseToastConfig,
		style: `
			${baseStyle}
			color: #00f3ff;
			border-color: #00f3ff40;
		`,
		iconTheme: {
			primary     : '#00f3ff',
			secondary   : '#050924'
		},
	};
};

// Success toast with green accent
export const successToast = (): ToastOptions => {
	return {
		...baseToastConfig,
		style: `
			${baseStyle}
			color: #00f3ff;
			border-color: #00f3ff40;
		`,
		iconTheme: {
			primary     : '#00f3ff',
			secondary   : '#050924'
		},
	};
};

// Error toast with red accent
export const errorToast = (): ToastOptions => {
	return {
		...baseToastConfig,
		style: `
			${baseStyle}
			color: #F87171;
			border-color: #F8717140;
		`,
		iconTheme: {
			primary     : '#F87171',
			secondary   : '#050924'
		}
	};
};

// Warning toast with yellow accent
export const warningToast = (): ToastOptions => {
	return {
		...baseToastConfig,
		style: `
			${baseStyle}
			color: #FBBF24;
			border-color: #FBBF2440;
		`,
		iconTheme: {
			primary     : '#FBBF24',
			secondary   : '#050924'
		}
	};
};

// Info toast with cyber blue accent
export const infoToast = (): ToastOptions => {
	return {
		...baseToastConfig,
		style: `
			${baseStyle}
			color: #0066cc;
			border-color: #0066cc40;
		`,
		iconTheme: {
			primary     : '#0066cc',
			secondary   : '#050924'
		}
	};
};
