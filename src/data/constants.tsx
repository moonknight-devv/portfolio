
import { Globe, Shield, Layers, Activity } from 'lucide-react';
import type { Project, Theme, Identity } from './types';

export const INITIAL_PROJECTS: Project[] = [
    {
        id: 1,
        title: 'Scarab Browser',
        tech: 'React & Rust',
        owner: 'Steven',
        icon: <Globe className="w-6 h-6" />,
        stats: { complexity: 'High', security: '99%', perf: '12ms' },
        link: '#'
    },
    {
        id: 2,
        title: 'Ennead Security',
        tech: 'Python & AWS',
        owner: 'Marc',
        icon: <Shield className="w-6 h-6" />,
        stats: { complexity: 'High', security: '100%', perf: '110ms' },
        link: '#'
    },
    {
        id: 3,
        title: 'Khonshu Engine',
        tech: 'C++ & Vulkan',
        owner: 'Marc',
        icon: <Layers className="w-6 h-6" />,
        stats: { complexity: 'Extreme', security: '88%', perf: '2ms' },
        link: '#'
    },
    {
        id: 4,
        title: 'Taxi Tracker',
        tech: 'Go & Redis',
        owner: 'Jake',
        icon: <Activity className="w-6 h-6" />,
        stats: { complexity: 'Medium', security: '80%', perf: '5ms' },
        link: '#'
    }
];

export const THEMES: Record<Identity, Theme> = {
    Marc: { color: 'text-blue-400', border: 'border-blue-500/30', bg: 'bg-blue-500/10', glowColor: 'rgba(59,130,246,', tagline: 'STRATEGIC_INTERVENTION' },
    Steven: { color: 'text-amber-400', border: 'border-amber-500/30', bg: 'bg-amber-500/10', glowColor: 'rgba(245,158,11,', tagline: 'SCHOLARLY_EXCAVATION' },
    Jake: { color: 'text-rose-500', border: 'border-rose-500/30', bg: 'bg-rose-500/10', glowColor: 'rgba(244,63,94,', tagline: 'UNFILTERED_EXECUTION' }
};
