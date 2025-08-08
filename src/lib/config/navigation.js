import { House, Gauge, CloudDrizzle, Toilet, BookText } from '@lucide/svelte';
import { IdaIce } from '$lib/icons/index';

export const navLinks = [
	{
		title: 'Hem',
		href: '/',
		icon: House,
		children: []
	},
	{
		title: 'Tryckfall',
		href: '/tryckfall',
		icon: Gauge,
		children: [
			{
				title: 'Rör',
				href: '/tryckfall/ror'
			},
			{
				title: 'Luft',
				href: '/tryckfall/luft'
			}
		]
	},
	{
		title: 'Dagvatten',
		href: '/dagvatten',
		icon: CloudDrizzle,
		children: [
			{
				title: 'Sannolikt flöde',
				href: '/dagvatten/flode'
			},
			{
				title: 'Stuprör',
				href: '/dagvatten/stupror'
			}
		]
	},
	{
		title: 'Spillvatten',
		href: '/spillvatten',
		icon: Toilet,
		children: [
			{
				title: 'Flöde',
				href: '/spillvatten/flode'
			},
			{
				title: 'Fettavskiljare',
				href: '/spillvatten/fettavskiljare'
			}
		]
	},
	{
		title: 'Skript - IDA ICE',
		href: '/ida-ice-skript',
		icon: IdaIce,
		children: []
	},
	{
		title: 'Wiki',
		href: '/wiki',
		icon: BookText,
		children: []
	}
];
