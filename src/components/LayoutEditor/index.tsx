import React from 'react';
import { Layout as LayoutIcon, RotateCcw } from 'lucide-react';
import { useLayout } from '../../contexts/LayoutContext';

const LayoutEditor: React.FC = () => {
    const { isEditMode, setIsEditMode, resetLayout } = useLayout();
    const [confirmReset, setConfirmReset] = React.useState(false);

    return (
        <section>
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6 flex items-center gap-2">
                <LayoutIcon className="w-3 h-3" /> Layout_Control
            </h3>
            <div className="space-y-4">
                <div className="bg-white/[0.03] rounded-xl p-6 border border-white/5">
                    <div className="flex items-center justify-between mb-2">
                        <div>
                            <p className="text-[9px] font-black text-white uppercase tracking-widest">
                                Edit Mode
                            </p>
                            <p className="text-[8px] text-slate-600 mt-1 font-mono">
                                {isEditMode ? 'Drag & resize active' : 'Static layout'}
                            </p>
                        </div>
                        <button
                            onClick={() => setIsEditMode(!isEditMode)}
                            className={`px-6 py-3 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${isEditMode
                                    ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)]'
                                    : 'bg-white/5 text-slate-500 border border-white/5 hover:bg-white/10'
                                }`}
                        >
                            {isEditMode ? 'ON' : 'OFF'}
                        </button>
                    </div>
                </div>

                {confirmReset ? (
                    <div className="bg-rose-900/20 rounded-xl p-6 border border-rose-500/30">
                        <p className="text-[9px] font-black text-rose-400 uppercase tracking-widest mb-4">
                            Confirm Reset?
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setConfirmReset(false)}
                                className="flex-1 py-3 rounded-lg text-[8px] font-black uppercase bg-white/5 text-slate-500 hover:bg-white/10 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    resetLayout();
                                    setConfirmReset(false);
                                }}
                                className="flex-1 py-3 rounded-lg text-[8px] font-black uppercase bg-rose-600 text-white hover:bg-rose-500 transition-all"
                            >
                                Reset
                            </button>
                        </div>
                    </div>
                ) : (
                    <button
                        onClick={() => setConfirmReset(true)}
                        className="w-full py-3 rounded-lg text-[8px] font-black uppercase tracking-widest bg-white/5 text-slate-500 border border-white/5 hover:border-rose-500/50 hover:text-rose-500 transition-all flex items-center justify-center gap-2"
                    >
                        <RotateCcw className="w-3 h-3" />
                        Reset Layout
                    </button>
                )}
            </div>
        </section>
    );
};

export default LayoutEditor;
