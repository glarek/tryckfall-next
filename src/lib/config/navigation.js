import { Gauge, CloudDrizzle, Toilet, BookText } from '@lucide/svelte';
import { IdaIce } from '$lib/icons/index';

export const navLinks = [
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
		title: 'Energi',
		href: '/energi',
		icon: IdaIce,
		children: [
			{
				title: 'IDA ICE-skript',
				href: '/energi/ida-ice-skript'
			},
			{
				title: 'Läs in energideklaration',
				href: '/energi/laes-in-energideklaration'
			}
		]
	},
	{
		title: 'Wiki',
		href: '/wiki',
		icon: BookText,
		children: []
	}
];
