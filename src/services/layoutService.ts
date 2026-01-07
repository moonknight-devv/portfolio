export interface AssetLayout {
    x: number;
    y: number;
    width: number | string;
    height: number | string;
}

export interface LayoutConfig {
    [assetId: string]: AssetLayout;
}

const STORAGE_KEY = 'portfolio-layout';

export const layoutService = {
    getLayoutConfig(): LayoutConfig {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (!stored) return {};

            const parsed = JSON.parse(stored);
            return this.validateLayoutConfig(parsed) ? parsed : {};
        } catch (error) {
            console.error('Error loading layout config:', error);
            return {};
        }
    },

    setLayoutConfig(config: LayoutConfig): void {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
        } catch (error) {
            console.error('Error saving layout config:', error);
        }
    },

    updateAssetLayout(assetId: string, layout: AssetLayout): void {
        const config = this.getLayoutConfig();
        config[assetId] = layout;
        this.setLayoutConfig(config);
    },

    resetLayout(): void {
        try {
            localStorage.removeItem(STORAGE_KEY);
        } catch (error) {
            console.error('Error resetting layout:', error);
        }
    },

    validateLayoutConfig(config: unknown): config is LayoutConfig {
        if (!config || typeof config !== 'object') return false;

        for (const key in config) {
            const layout = (config as LayoutConfig)[key];
            if (!layout || typeof layout !== 'object') return false;
            if (typeof layout.x !== 'number' || typeof layout.y !== 'number') return false;
            if (typeof layout.width !== 'number' && typeof layout.width !== 'string') return false;
            if (typeof layout.height !== 'number' && typeof layout.height !== 'string') return false;
        }

        return true;
    }
};
