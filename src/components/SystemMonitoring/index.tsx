import React from 'react';
import { Cpu as CpuIcon, Shield, Database } from 'lucide-react';
import type { Theme, Identity } from '../../data/types';

interface SystemMonitoringProps {
    theme: Theme;
    identity: Identity;
}

const SystemMonitoring: React.FC<SystemMonitoringProps> = ({ theme, identity }) => {
    return (
        <section className="py-20 px-10 max-w-6xl mx-auto relative z-20" aria-label="System Health Monitoring">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className={`p-8 rounded-[2.5rem] bg-white/[0.02] border ${theme.border} backdrop-blur-xl group hover:bg-white/[0.05] transition-all`}>
                    <div className="flex items-center gap-4 mb-6">
                        <div className={`p-3 rounded-xl ${theme.bg}`} aria-hidden="true"><CpuIcon className={`w-5 h-5 ${theme.color}`} /></div>
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-white">Core_Usage</h3>
                    </div>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden mb-3" role="progressbar" aria-valuenow={identity === 'Marc' ? 65 : identity === 'Steven' ? 30 : 95} aria-valuemin={0} aria-valuemax={100} aria-label="System CPU Core Usage">
                        <div className={`h-full ${identity === 'Marc' ? 'bg-blue-500 w-[65%]' : identity === 'Steven' ? 'bg-amber-500 w-[30%]' : 'bg-rose-600 w-[95%]'} animate-pulse`} />
                    </div>
                    <p className="text-[9px] font-mono text-slate-500 uppercase tracking-tighter">Integrity_Check: Secure</p>
                </div>

                <div className={`p-8 rounded-[2.5rem] bg-white/[0.02] border ${theme.border} backdrop-blur-xl group hover:bg-white/[0.05] transition-all`}>
                    <div className="flex items-center gap-4 mb-6">
                        <div className={`p-3 rounded-xl ${theme.bg}`} aria-hidden="true"><Shield className={`w-5 h-5 ${theme.color}`} /></div>
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-white">Encryption_Status</h3>
                    </div>
                    <p className="text-2xl font-black text-white italic tracking-tighter mb-2 uppercase">AES-256-GCM</p>
                    <p className="text-[9px] font-mono text-slate-500 uppercase tracking-tighter">End-to-end Tunnel Active</p>
                </div>
                <div className={`p-8 rounded-[2.5rem] bg-white/[0.02] border ${theme.border} backdrop-blur-xl group hover:bg-white/[0.05] transition-all`}>
                    <div className="flex items-center gap-4 mb-6">
                        <div className={`p-3 rounded-xl ${theme.bg}`} aria-hidden="true"><Database className={`w-5 h-5 ${theme.color}`} /></div>
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-white">Sanitization</h3>
                    </div>
                    <p className="text-2xl font-black text-white italic tracking-tighter mb-2 uppercase">SQL_FILTER_v4</p>
                    <p className="text-[9px] font-mono text-slate-500 uppercase tracking-tighter">All inputs filtered for exploits</p>
                </div>
            </div>
        </section>
    );
};

export default React.memo(SystemMonitoring);
