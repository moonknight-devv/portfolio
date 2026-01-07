import React, { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { LayoutConfig, AssetLayout } from '../data/types';
import { layoutService } from '../services/layoutService';

interface LayoutContextType {
    layoutConfig: LayoutConfig;
    isEditMode: boolean;
    setIsEditMode: (enabled: boolean) => void;
    updateLayout: (assetId: string, layout: AssetLayout) => void;
    resetLayout: () => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export const useLayout = () => {
    const context = useContext(LayoutContext);
    if (!context) {
        throw new Error('useLayout must be used within LayoutProvider');
    }
    return context;
};

interface LayoutProviderProps {
    children: ReactNode;
}

export const LayoutProvider: React.FC<LayoutProviderProps> = ({ children }) => {
    const [layoutConfig, setLayoutConfig] = useState<LayoutConfig>(() =>
        layoutService.getLayoutConfig()
    );
    const [isEditMode, setIsEditMode] = useState(false);

    const updateLayout = useCallback((assetId: string, layout: AssetLayout) => {
        setLayoutConfig(prev => {
            const updated = { ...prev, [assetId]: layout };
            layoutService.setLayoutConfig(updated);
            return updated;
        });
    }, []);

    const resetLayout = useCallback(() => {
        layoutService.resetLayout();
        setLayoutConfig({});
        setIsEditMode(false);
    }, []);

    const value: LayoutContextType = {
        layoutConfig,
        isEditMode,
        setIsEditMode,
        updateLayout,
        resetLayout
    };

    return (
        <LayoutContext.Provider value={value}>
            {children}
        </LayoutContext.Provider>
    );
};
