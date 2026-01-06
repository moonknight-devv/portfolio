import React from 'react';
import { Waves, BarChart3 } from 'lucide-react';
import type { Theme, Identity } from '../../data/types';

interface IdentityMetricsProps {
    theme: Theme;
    identity: Identity;
}

const IdentityMetrics: React.FC<IdentityMetricsProps> = ({ theme, identity }) => {
    return (
        <section className="py-20 px-10 max-w-6xl mx-auto relative z-20" aria-labelledby="metrics-title">
            <div className={`p-12 rounded-[3.5rem] bg-white/[0.01] border ${theme.border} backdrop-blur-3xl overflow-hidden relative group`}>
                {/* Subtle Background Glow */}
                <div className={`absolute -right-20 -top-20 w-64 h-64 blur-[120px] rounded-full ${theme.bg} opacity-20`} aria-hidden="true" />

                <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
                    <div className="flex-1 space-y-8 w-full">
                        <div className="flex items-center gap-4">
                            <Waves className={`w-5 h-5 ${theme.color} animate-pulse`} aria-hidden="true" />
                            <h3 id="metrics-title" className="text-[11px] font-black uppercase tracking-[0.5em] text-white">Cognitive_Alignment_Monitor</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white/5 p-6 rounded-3xl border border-white/5 hover:border-white/10 transition-all">
                                <div className="flex justify-between items-end mb-4">
                                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Stability</span>
                                    <span className={`text-xs font-mono font-bold ${theme.color}`}>88.4%</span>
                                </div>
                                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden" role="progressbar" aria-valuenow={88.4} aria-valuemin={0} aria-valuemax={100} aria-label="Cognitive Stability">
                                    <div className={`h-full ${theme.color.replace('text', 'bg')} w-[88%]`} />
                                </div>
                            </div>
                            <div className="bg-white/5 p-6 rounded-3xl border border-white/5 hover:border-white/10 transition-all">
                                <div className="flex justify-between items-end mb-4">
                                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Neural_Sync</span>
                                    <span className="text-xs font-mono font-bold text-white">Active</span>
                                </div>
                                <div className="flex gap-1 items-center h-1.5" role="progressbar" aria-valuenow={80} aria-valuemin={0} aria-valuemax={100} aria-label="Neural Synchronization Level">
                                    {[1, 2, 3, 4, 5, 6].map(i => (
                                        <div key={i} className={`h-full flex-1 rounded-full ${i < 5 ? theme.color.replace('text', 'bg') : 'bg-white/10'} animate-pulse`} style={{ animationDelay: `${i * 150}ms` }} aria-hidden="true" />
                                    ))}
                                </div>
                            </div>
                            <div className="bg-white/5 p-6 rounded-3xl border border-white/5 hover:border-white/10 transition-all">
                                <div className="flex justify-between items-end mb-4">
                                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Heart_Rate</span>
                                    <span className="text-xs font-mono font-bold text-rose-500">72 BPM</span>
                                </div>
                                <div className="h-1.5 w-full flex items-center gap-0.5" role="img" aria-label="Heart Rate Visualization (Fluctuating around 72 BPM)">
                                    {[...Array(20)].map((_, i) => (
                                        <div key={i} className="w-1 bg-rose-500/40 rounded-full" style={{ height: `${Math.random() * 100}%` }} aria-hidden="true" />
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-black/40 rounded-2xl border border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className={`w-2 h-2 rounded-full ${theme.color.replace('text', 'bg')} animate-ping`} aria-hidden="true" />
                                <span className="text-[10px] font-mono text-slate-400">LOG_STREAM: Identity_Phase_Detected [{identity.toUpperCase()}] ... Integrity_Verified</span>
                            </div>
                            <BarChart3 className="w-4 h-4 text-slate-600" aria-hidden="true" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default React.memo(IdentityMetrics);
