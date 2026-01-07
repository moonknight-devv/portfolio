import React from 'react';

export type Identity = 'Marc' | 'Steven' | 'Jake';

export interface Theme {
    color: string;
    border: string;
    bg: string;
    glowColor: string;
    tagline: string;
}

export interface ProjectStats {
    complexity: string;
    security: string;
    perf: string;
}

export interface Project {
    id: number;
    title: string;
    tech: string;
    owner: Identity | string;
    icon: React.ReactNode;
    stats: ProjectStats;
    link: string;
}

export interface SocialLinks {
    [key: string]: string;
}

export interface UiSettings {
    glowIntensity: number;
    glassOpacity: number;
}

export interface ProfilePics {
    [key: string]: string;
}

export interface Log {
    type: 'sys' | 'user';
    text: string;
}

// Layout Editor Types
export interface AssetLayout {
    x: number;
    y: number;
    width: number | string;
    height: number | string;
}

export interface LayoutConfig {
    [assetId: string]: AssetLayout;
}
