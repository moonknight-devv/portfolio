import React, { useState } from 'react';
import {
    Radio, AlertTriangle, RefreshCcw, Lock, Fingerprint, Settings, X, UserCircle, Plus, Code, Link as LinkIcon, Github, Twitter, Linkedin, Instagram, Terminal, Palette
} from 'lucide-react';
import type { Project, Identity, UiSettings, SocialLinks, ProfilePics } from '../../data/types';

import { projectService } from '../../services/projectService';
import { useAdminAuth } from '../../hooks/useAdminAuth';

interface AdminPortalProps {
    isOpen: boolean;
    onClose: () => void;
    projects: Project[];
    setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
    identity: Identity;
    setIdentity: React.Dispatch<React.SetStateAction<Identity>>;
    uiSettings: UiSettings;
    setUiSettings: React.Dispatch<React.SetStateAction<UiSettings>>;
    socialLinks: SocialLinks;
    setSocialLinks: React.Dispatch<React.SetStateAction<SocialLinks>>;
    profilePics: ProfilePics;
    setProfilePics: React.Dispatch<React.SetStateAction<ProfilePics>>;
}

const AdminPortal: React.FC<AdminPortalProps> = ({
    isOpen,
    onClose,
    projects,
    setProjects,
    identity,
    setIdentity,
    uiSettings,
    setUiSettings,
    socialLinks,
    setSocialLinks,
    profilePics,
    setProfilePics
}) => {
    const {
        isAuthenticated,
        isVerifying,
        isLocked,
        attempts,
        lastError,
        login,
        logout,
        MAX_ATTEMPTS
    } = useAdminAuth();

    const [passcode, setPasscode] = useState("");
    const [error, setError] = useState(false);
    const [newProject, setNewProject] = useState({ title: "", tech: "", owner: "Marc" });
    const [logs, setLogs] = useState<string[]>([
        "SECURE_BOOT_v4.5 initiated...",
        "Validating Terminal Integrity...",
        "Awaiting Ennead clearance..."
    ]);

    const portalRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'Tab') {
                const focusableElements = portalRef.current?.querySelectorAll(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                );
                if (!focusableElements || focusableElements.length === 0) return;

                const firstElement = focusableElements[0] as HTMLElement;
                const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        lastElement.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        firstElement.focus();
                        e.preventDefault();
                    }
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    const addLog = (msg: string) => {
        setLogs(prev => [...prev.slice(-15), `[${new Date().toLocaleTimeString()}] ${msg}`]);
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        addLog(`Initiating handshake with sequence: ${"*".repeat(passcode.length)}`);

        const success = await login(passcode);

        if (success) {
            setError(false);
            addLog("AUTH_SUCCESS: Session token generated. Welcome back.");
        } else {
            setError(true);
            addLog(`AUTH_FAILURE: ${lastError || "Sequence rejected."}`);
            setTimeout(() => setError(false), 1000);
        }
    };

    const [confirmingDelete, setConfirmingDelete] = useState<number | null>(null);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[200] flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-portal-title"
            ref={portalRef}
        >
            <div className="absolute inset-0 bg-black/98 backdrop-blur-3xl" onClick={onClose} aria-hidden="true" />
            <div className={`relative w-full max-w-6xl h-[90vh] bg-[#050507] border ${error ? 'border-rose-500 shadow-[0_0_50px_rgba(244,63,94,0.2)]' : 'border-white/10'} rounded-[3rem] overflow-hidden flex flex-col shadow-2xl transition-all duration-500 ${error ? 'animate-shake' : ''}`}>

                {/* CRT Scanline Overlay */}
                <div className="absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_100%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-50 bg-[length:100%_4px,4px_100%]" aria-hidden="true" />

                {!isAuthenticated ? (
                    <div className="flex-1 flex flex-col md:flex-row">
                        {/* Login Visual Sidebar */}
                        <div className="hidden md:flex w-1/2 bg-white/[0.02] border-r border-white/5 flex-col p-12 relative overflow-hidden">
                            <div className="absolute inset-0 opacity-20" aria-hidden="true">
                                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:30px_30px]" />
                            </div>

                            <div className="mt-auto space-y-6 relative z-10">
                                <div className="flex items-center gap-4 text-white/40">
                                    <Radio className="w-5 h-5 animate-pulse" aria-hidden="true" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.5em]">Terminal_Active</span>
                                </div>
                                <h2 id="admin-portal-title" className="text-4xl font-black text-white leading-tight uppercase tracking-tighter italic">
                                    The Mind is a <br /><span className="text-blue-500">Multiverse.</span>
                                </h2>
                                <p className="text-slate-500 text-xs font-mono leading-relaxed max-w-sm">
                                    Accessing the Spector System requires verified Ennead clearance. All attempts are logged and sanitized via SQL_FILTER_v4.
                                </p>
                            </div>
                        </div>

                        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center relative">
                            {isLocked ? (
                                <div className="animate-in zoom-in duration-500">
                                    <AlertTriangle className="w-20 h-20 text-rose-500 mb-6 mx-auto animate-pulse" aria-hidden="true" />
                                    <h2 className="text-3xl font-black text-rose-500 uppercase tracking-[0.5em] italic">SYSTEM_LOCKDOWN</h2>
                                    <p className="text-slate-500 text-[10px] mt-4 uppercase tracking-widest font-mono">Security breach protocol active. Access denied.</p>
                                    <button onClick={onClose} aria-label="Emergency System Exit" className="mt-8 px-10 py-3 border border-rose-500/30 text-rose-500 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-rose-500 hover:text-white transition-all">Emergency Exit</button>
                                </div>
                            ) : (
                                <>
                                    <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-8 border transition-all duration-500 ${isVerifying ? 'border-blue-500 rotate-180' : 'border-white/10'}`} aria-hidden="true">
                                        {isVerifying ? <RefreshCcw className="w-8 h-8 text-blue-500 animate-spin" /> : <Lock className="w-8 h-8 text-white" />}
                                    </div>

                                    <h2 id="admin-portal-title" className="text-2xl font-black uppercase tracking-[0.4em] text-white mb-2 italic">
                                        {isVerifying ? 'Syncing...' : 'Spector_ID'}
                                    </h2>
                                    <p className="text-[9px] text-slate-500 uppercase tracking-widest mb-10 font-mono">Status: Awaiting_Sequence // Attempts: {attempts}/{MAX_ATTEMPTS}</p>

                                    <form onSubmit={handleLogin} className="w-full max-w-xs space-y-4">
                                        <div className="relative">
                                            <input
                                                type="password" autoFocus
                                                value={passcode}
                                                disabled={isVerifying}
                                                onChange={(e) => setPasscode(e.target.value)}
                                                placeholder="••••"
                                                aria-label="Passcode Sequence"
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-center font-mono tracking-[1em] outline-none focus:border-white/30 text-white transition-all disabled:opacity-50"
                                            />
                                            {error && <div role="alert" className="absolute -bottom-6 left-0 w-full text-[9px] text-rose-500 font-bold uppercase tracking-widest">Invalid Sequence detected</div>}
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={isVerifying}
                                            aria-label="Authorize Access Sequence"
                                            className="w-full bg-white text-black font-black uppercase tracking-[0.3em] py-5 rounded-2xl hover:bg-blue-400 transition-all flex items-center justify-center gap-3 disabled:bg-slate-800 disabled:text-slate-500"
                                        >
                                            {isVerifying ? 'Verifying...' : 'Authorize Access'} <Fingerprint className="w-4 h-4" aria-hidden="true" />
                                        </button>
                                    </form>
                                </>
                            )}
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Authenticated Dashboard Header */}
                        <div className="p-8 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2"><Settings className="w-3 h-3" aria-hidden="true" /> System_Registry_Authenticated</span>
                                </div>
                                <div className="h-4 w-px bg-white/10" aria-hidden="true" />
                                <span className="text-[10px] font-mono text-emerald-500/70 tracking-tighter">SECURE_TUNNEL: AES-256-GCM ACTIVE</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <button onClick={logout} className="text-[8px] font-black uppercase tracking-widest text-rose-500 hover:text-rose-400 transition-colors">Terminate_Session</button>
                                <button onClick={onClose} aria-label="Close Admin Portal" className="p-2 hover:bg-white/10 rounded-full transition-all group">
                                    <X className="w-5 h-5 text-white group-hover:rotate-90 transition-transform" aria-hidden="true" />
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
                            {/* Left Column: Management */}
                            <div className="flex-1 overflow-y-auto p-10 space-y-12 custom-scrollbar">

                                {/* Visual Identity Management */}
                                <section>
                                    <div className="flex justify-between items-end mb-6">
                                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 flex items-center gap-2"><UserCircle className="w-3 h-3 text-white" /> Identity_Visuals</h3>
                                        <span className="text-[8px] font-mono text-slate-600">AVATAR_MODULE_v1</span>
                                    </div>
                                    <div className="bg-white/[0.03] rounded-[2.5rem] p-8 space-y-6 border border-white/5">
                                        {['Marc', 'Steven', 'Jake'].map((id) => (
                                            <div key={id} className="flex flex-col md:flex-row gap-4 items-center">
                                                <div className="w-12 h-12 rounded-full overflow-hidden bg-white/5 border border-white/10 flex-shrink-0">
                                                    {profilePics[id] ? (
                                                        <img src={profilePics[id]} alt={id} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-[10px] font-black">{id[0]}</div>
                                                    )}
                                                </div>
                                                <div className="flex-1 space-y-1 w-full">
                                                    <label className="text-[8px] font-black uppercase text-slate-600 tracking-widest ml-1">{id}_Avatar_URL</label>
                                                    <input
                                                        className="w-full bg-black/40 border border-white/5 rounded-xl p-3 text-[10px] font-mono text-white outline-none focus:border-white/30 transition-colors"
                                                        placeholder="https://..."
                                                        value={profilePics[id] || ''}
                                                        onChange={e => {
                                                            const updated = { ...profilePics, [id]: e.target.value };
                                                            setProfilePics(updated);
                                                            addLog(`Identity Visual Updated: ${id.toUpperCase()}`);
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                <section>
                                    <div className="flex justify-between items-end mb-6">
                                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 flex items-center gap-2"><Plus className="w-3 h-3 text-blue-500" /> Commit_New_Project</h3>
                                        <span className="text-[8px] font-mono text-slate-600">v4.2.0_DEPLOY</span>
                                    </div>
                                    <div className="bg-white/[0.03] rounded-[2.5rem] p-8 space-y-4 border border-white/5">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-[8px] font-black uppercase text-slate-600 tracking-widest ml-2">Project_Title</label>
                                                <input className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 text-[11px] font-bold uppercase tracking-widest text-white outline-none focus:border-blue-500/50 transition-colors" placeholder="e.g. DARK_WIND" value={newProject.title} onChange={e => setNewProject({ ...newProject, title: e.target.value })} />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[8px] font-black uppercase text-slate-600 tracking-widest ml-2">Tech_Stack</label>
                                                <input className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 text-[11px] font-bold uppercase tracking-widest text-white outline-none focus:border-blue-500/50 transition-colors" placeholder="e.g. KOTLIN & FIREBASE" value={newProject.tech} onChange={e => setNewProject({ ...newProject, tech: e.target.value })} />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[8px] font-black uppercase text-slate-600 tracking-widest ml-2">Assigned_Identity</label>
                                            <div className="grid grid-cols-3 gap-3">
                                                {['Marc', 'Steven', 'Jake'].map(id => (
                                                    <button key={id} onClick={() => setNewProject({ ...newProject, owner: id })} className={`py-3 rounded-xl text-[9px] font-black uppercase transition-all ${newProject.owner === id ? 'bg-white text-black scale-[1.02]' : 'bg-white/5 text-slate-500 border border-white/5 hover:bg-white/10'}`}>{id}</button>
                                                ))}
                                            </div>
                                        </div>

                                        <button onClick={async () => {
                                            if (!newProject.title) return;
                                            const project: Project = { ...newProject, id: Date.now(), icon: <Code className="w-6 h-6" />, stats: { complexity: 'New', security: '95%', perf: 'pending' }, link: '#' };

                                            // Service call
                                            const addedProject = await projectService.addProject(project);
                                            setProjects(prev => [addedProject, ...prev]);

                                            addLog(`New entry committed: ${newProject.title} [Owner: ${newProject.owner}]`);
                                            setNewProject({ title: "", tech: "", owner: identity });
                                        }} className="w-full bg-blue-600 text-white font-black uppercase tracking-[0.2em] py-5 rounded-2xl text-[11px] hover:bg-blue-500 shadow-xl shadow-blue-500/20 transition-all active:scale-[0.98]">Push_To_Archives</button>
                                    </div>
                                </section>

                                {/* Social Media Link Management */}
                                <section>
                                    <div className="flex justify-between items-end mb-6">
                                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 flex items-center gap-2"><LinkIcon className="w-3 h-3 text-emerald-500" /> Social_Relays</h3>
                                        <span className="text-[8px] font-mono text-slate-600">ENCRYPTED_OUTBOUND</span>
                                    </div>
                                    <div className="bg-white/[0.03] rounded-[2.5rem] p-8 space-y-4 border border-white/5">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {Object.keys(socialLinks).map(platform => (
                                                <div key={platform} className="space-y-2">
                                                    <label className="text-[8px] font-black uppercase text-slate-600 tracking-widest ml-2 flex items-center gap-2">
                                                        {platform === 'github' && <Github className="w-2.5 h-2.5" />}
                                                        {platform === 'twitter' && <Twitter className="w-2.5 h-2.5" />}
                                                        {platform === 'linkedin' && <Linkedin className="w-2.5 h-2.5" />}
                                                        {platform === 'instagram' && <Instagram className="w-2.5 h-2.5" />}
                                                        {platform}_URI
                                                    </label>
                                                    <input
                                                        className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 text-[11px] font-mono text-white outline-none focus:border-emerald-500/50 transition-colors"
                                                        placeholder={`https://${platform}.com/...`}
                                                        value={socialLinks[platform]}
                                                        onChange={e => {
                                                            const updated = { ...socialLinks, [platform]: e.target.value };
                                                            setSocialLinks(updated);
                                                            addLog(`Social Relay Updated: ${platform.toUpperCase()}`);
                                                        }}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </section>

                                <section>
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6 italic">Active_Deployments</h3>
                                    <div className="space-y-3">
                                        {projects.map(p => (
                                            <div key={p.id} className="bg-white/[0.02] rounded-2xl p-5 flex justify-between items-center border border-white/5 hover:bg-white/5 transition-all group">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-white/5 text-slate-500 group-hover:text-blue-400 transition-colors`}>{p.icon}</div>
                                                    <div className="flex flex-col">
                                                        <span className="text-[10px] font-black text-white tracking-widest uppercase">{p.title}</span>
                                                        <span className="text-[8px] text-slate-600 font-mono uppercase tracking-tighter">Owner: {p.owner} // Hash: {Math.random().toString(36).substring(7)}</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {confirmingDelete === p.id ? (
                                                        <>
                                                            <button
                                                                onClick={() => setConfirmingDelete(null)}
                                                                className="text-[9px] font-black uppercase text-slate-500 hover:text-white transition-colors"
                                                            >
                                                                CANCEL
                                                            </button>
                                                            <button
                                                                onClick={async () => {
                                                                    await projectService.deleteProject(p.id);
                                                                    setProjects(prev => prev.filter(pr => pr.id !== p.id));
                                                                    addLog(`Deleted entry: ${p.title}`);
                                                                    setConfirmingDelete(null);
                                                                }}
                                                                className="text-[9px] font-black uppercase text-rose-500 hover:text-rose-400 animate-pulse"
                                                            >
                                                                CONFIRM_ERASE
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <button
                                                            onClick={() => setConfirmingDelete(p.id)}
                                                            aria-label={`Delete ${p.title}`}
                                                            className="text-slate-600 hover:text-rose-500 p-2 transition-all"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            </div>

                            {/* Right Column: System Status & Overrides */}
                            <div className="w-full md:w-80 border-l border-white/5 bg-white/[0.01] flex flex-col">
                                <div className="p-8 flex-1 space-y-10 overflow-y-auto custom-scrollbar">
                                    <section>
                                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6 flex items-center gap-2"><Palette className="w-3 h-3" /> System_UI</h3>
                                        <div className="space-y-8">
                                            <div className="space-y-3">
                                                <div className="flex justify-between text-[9px] font-black text-slate-500 uppercase"><span>Bloom</span><span>{uiSettings.glowIntensity}%</span></div>
                                                <input type="range" min="0" max="100" value={uiSettings.glowIntensity} onChange={e => setUiSettings({ ...uiSettings, glowIntensity: Number(e.target.value) })} className="w-full accent-blue-500" />
                                            </div>
                                            <div className="space-y-3">
                                                <div className="flex justify-between text-[9px] font-black text-slate-500 uppercase"><span>Opacity</span><span>{uiSettings.glassOpacity}%</span></div>
                                                <input type="range" min="2" max="25" value={uiSettings.glassOpacity} onChange={e => setUiSettings({ ...uiSettings, glassOpacity: Number(e.target.value) })} className="w-full accent-blue-500" />
                                            </div>
                                        </div>
                                    </section>

                                    <section>
                                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6">Force_Identity</h3>
                                        <div className="flex flex-col gap-2">
                                            {['Marc', 'Steven', 'Jake'].map(id => (
                                                <button
                                                    key={id}
                                                    onClick={() => {
                                                        setIdentity(id as Identity);
                                                        addLog(`CORE_OVERRIDE: Identity hijacked to ${id.toUpperCase()}.`);
                                                    }}
                                                    className={`py-4 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all relative overflow-hidden group ${identity === id ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)]' : 'bg-white/5 text-slate-500 border border-white/5 hover:border-rose-500/50 hover:text-rose-500'}`}
                                                >
                                                    <div className="absolute inset-0 bg-rose-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    {id}
                                                </button>
                                            ))}
                                        </div>
                                    </section>
                                </div>

                                {/* Real-time System Logs Terminal */}
                                <div className="p-6 bg-black border-t border-white/10 h-64 overflow-hidden flex flex-col">
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-[8px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2"><Terminal className="w-2.5 h-2.5" /> SYSTEM_LOGS</span>
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping" />
                                    </div>
                                    <div className="flex-1 font-mono text-[9px] text-slate-400 space-y-1 overflow-y-auto custom-scrollbar italic">
                                        {logs.map((log, i) => (
                                            <div key={i} className="flex gap-2">
                                                <span className="text-blue-900 select-none">»</span>
                                                <span className={log.includes("ACCESS") ? "text-emerald-500" : ""}>{log}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default React.memo(AdminPortal);
