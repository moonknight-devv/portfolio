import React from 'react';
import { Sparkles } from 'lucide-react';
import type { Theme } from '../../data/types';

interface LoreOverlayProps {
    theme: Theme;
    lore: string;
    onDismiss: (e: React.MouseEvent) => void;
}

const LoreOverlay: React.FC<LoreOverlayProps> = ({ theme, lore, onDismiss }) => {
    return (
        <div className="absolute inset-0 bg-black/95 p-12 flex flex-col items-center justify-center text-center animate-in zoom-in duration-300 z-[100]">
            <div className={`mb-6 p-4 rounded-full ${theme.bg}`}>
                <Sparkles className={`w-6 h-6 ${theme.color}`} />
            </div>
            <p className="text-[12px] font-mono leading-relaxed text-white uppercase tracking-widest italic mb-8">
                "{lore}"
            </p>
            <button
                onClick={onDismiss}
                className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors"
            >
                [ DISMISS_PROTOCOL ]
            </button>
        </div>
    );
};

export default React.memo(LoreOverlay);
