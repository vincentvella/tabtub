const colors = require('tailwindcss/colors')

module.exports = {
	content: ['./renderer/pages/**/*.{js,ts,jsx,tsx}', './renderer/components/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			data: {
				active: 'active~="true"',
				inactive: 'active~="false"',
			},
			minHeight: {
				400: '400px',
				500: '500px',
			},
			maxHeight: {
				400: '400px',
				500: '500px',
			},
			height: {
				400: '400px',
				500: '500px',
			}
		},
	},
	plugins: [
		require('tailwind-scrollbar'),
	],
}
