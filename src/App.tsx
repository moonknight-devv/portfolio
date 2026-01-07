import React, { useState, useEffect, useCallback, useMemo, Suspense } from 'react';
import { Moon } from 'lucide-react';
import type { Identity, Project, SocialLinks, UiSettings, ProfilePics } from './data/types';
import { THEMES } from './data/constants';
import { projectService } from './services/projectService';

import { LayoutProvider } from './contexts/LayoutContext';
import EditableAsset from './components/EditableAsset';
import Welcome from './components/Welcome';
import ProjectCard from './components/ProjectCard';
import ContactTerminal from './components/ContactTerminal';
import IdentityMetrics from './components/IdentityMetrics';
import SystemMonitoring from './components/SystemMonitoring';

import BackgroundGlow from './components/BackgroundGlow';
import { loreService } from './services/loreService';

const AdminPortal = React.lazy(() => import('./components/AdminPortal'));

const App: React.FC = () => {
  const [identity, setIdentity] = useState<Identity>('Marc');
  const [isSwitching, setIsSwitching] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState<number | null>(null);
  const [relicLore, setRelicLore] = useState<{ [key: number]: string }>({});
  const [uiSettings, setUiSettings] = useState<UiSettings>({ glowIntensity: 25, glassOpacity: 4 });
  const [socialLinks, setSocialLinks] = useState<SocialLinks>({
    github: 'https://github.com',
    twitter: 'https://twitter.com',
    linkedin: 'https://linkedin.com',
    instagram: 'https://instagram.com'
  });

  // New State for Identity Visuals
  const [profilePics, setProfilePics] = useState<ProfilePics>({
    Marc: "",
    Steven: "",
    Jake: ""
  });

  const currentTheme = useMemo(() => THEMES[identity], [identity]);

  const filteredProjects = useMemo(() =>
    projects.filter(p => p.owner === identity),
    [projects, identity]
  );

  useEffect(() => {
    const handleKeys = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') setIsAdminOpen(true);
    };
    window.addEventListener('keydown', handleKeys);

    // Initial data fetch
    const loadProjects = async () => {
      const data = await projectService.getProjects();
      setProjects(data);
      setIsLoaded(true);
    };
    loadProjects();

    return () => window.removeEventListener('keydown', handleKeys);
  }, []);

  const divineRelic = useCallback(async (project: Project | null) => {
    if (!project) { setRelicLore({}); return; }
    setIsAnalyzing(project.id);

    // Abstracted Service Call
    const lore = await loreService.getProjectLore(identity, project.id);

    setRelicLore({ [project.id]: lore });
    setIsAnalyzing(null);
  }, [identity]);

  const handleIdentityChange = useCallback((id: Identity) => {
    if (id === identity) return;
    setIsSwitching(true);
    setTimeout(() => {
      setIdentity(id);
      setIsSwitching(false);
    }, 400);
  }, [identity]);

  return (
    <LayoutProvider>
      <div
        className="min-h-screen bg-[#020204] text-slate-300 font-sans selection:bg-white selection:text-black overflow-x-hidden relative"
        role="document"
      >
        {/* Identity Transition Overlay */}
        <div className={`fixed inset-0 z-[1000] pointer-events-none transition-opacity duration-300 bg-white ${isSwitching ? 'opacity-20' : 'opacity-0'}`} aria-hidden="true" />
        <div className={`fixed inset-0 z-[1001] pointer-events-none transition-all duration-500 backdrop-blur-xl ${isSwitching ? 'opacity-100' : 'opacity-0'}`} aria-hidden="true">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <span className="text-white font-black tracking-[2em] text-xs animate-pulse uppercase">Resyncing_Neural_Pathways...</span>
          </div>
        </div>

        <BackgroundGlow color={currentTheme.glowColor} intensity={uiSettings.glowIntensity} />

        <Suspense fallback={null}>
          {isAdminOpen && (
            <AdminPortal
              isOpen={isAdminOpen}
              onClose={() => setIsAdminOpen(false)}
              projects={projects}
              setProjects={setProjects}
              identity={identity}
              setIdentity={setIdentity}
              uiSettings={uiSettings}
              setUiSettings={setUiSettings}
              socialLinks={socialLinks}
              setSocialLinks={setSocialLinks}
              profilePics={profilePics}
              setProfilePics={setProfilePics}
            />
          )}
        </Suspense>

        <header>
          <nav className="fixed top-0 w-full z-50 px-8 py-5 flex justify-between items-center bg-black/40 backdrop-blur-3xl border-b border-white/[0.05]" aria-label="Main Navigation">
            <div
              className="flex items-center gap-5 group cursor-pointer"
              onDoubleClick={() => setIsAdminOpen(true)}
              role="button"
              aria-label="Admin Portal Access (Double Click)"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setIsAdminOpen(true); }}
            >
              <div className="relative w-12 h-12 rounded-full bg-white flex items-center justify-center group-hover:rotate-[360deg] transition-transform duration-1000 shadow-[0_0_20px_rgba(255,255,255,0.15)] overflow-hidden">
                {profilePics[identity] ? (
                  <img src={profilePics[identity]} alt={`${identity} Profile`} className="w-full h-full object-cover" />
                ) : (
                  <Moon className="text-black w-7 h-7 fill-current" aria-hidden="true" />
                )}
              </div>
              <div className="flex flex-col">
                <span className="font-black tracking-[0.4em] text-[12px] uppercase text-white">Spector_System</span>
                <span className={`text-[8px] tracking-[0.5em] font-black uppercase transition-colors duration-300 ${currentTheme.color}`}>
                  {identity.toUpperCase()}_ACTIVE // SECURE_NODE
                </span>
              </div>
            </div>
            <div className="hidden md:flex gap-3 p-1 bg-white/5 rounded-full border border-white/10" role="radiogroup" aria-label="Identity Switcher">
              {['Marc', 'Steven', 'Jake'].map((id) => (
                <button
                  key={id}
                  onClick={() => handleIdentityChange(id as Identity)}
                  role="radio"
                  aria-checked={identity === id}
                  aria-label={`Switch to ${id} personality`}
                  className={`px-6 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all duration-300 ${identity === id ? 'bg-white text-black shadow-xl scale-105' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
                >
                  {id}
                </button>
              ))}
            </div>
          </nav>
        </header>

        <main>
          {/* Welcome Section */}
          <EditableAsset assetId="welcome" defaultPosition={{ x: 0, y: 100 }}>
            <Welcome />
          </EditableAsset>

          {/* Hero Section */}
          <section className="relative min-h-[70vh] flex flex-col items-center justify-center text-center px-8" aria-labelledby="hero-title">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.02] text-[20vw] font-black pointer-events-none uppercase tracking-tighter text-white" aria-hidden="true">
              {identity.toUpperCase()}
            </div>

            {/* Hero Visual */}
            {profilePics[identity] && (
              <div className="absolute inset-0 z-[-1] opacity-10 blur-3xl scale-150 pointer-events-none" aria-hidden="true">
                <img src={profilePics[identity]} alt="" className="w-full h-full object-cover" />
              </div>
            )}

            <h1 id="hero-title" className="text-[6rem] md:text-[10rem] font-serif italic mb-6 leading-none text-white tracking-tighter drop-shadow-2xl animate-in fade-in zoom-in duration-300">
              {identity === 'Marc' ? 'Soldier' : identity === 'Steven' ? 'Scholar' : 'Executioner'}
            </h1>
            <div className="flex items-center gap-6">
              <div className={`h-[1px] w-16 ${currentTheme.bg.replace('10', '40')}`} aria-hidden="true" />
              <p className={`text-[12px] font-black uppercase tracking-[1.5em] ${currentTheme.color}`}>THE_ARCHIVES</p>
              <div className={`h-[1px] w-16 ${currentTheme.bg.replace('10', '40')}`} aria-hidden="true" />
            </div>
          </section>

          {/* Archives Section */}
          <section className="relative z-10 py-20 px-8 max-w-[1700px] mx-auto" id="archives" aria-labelledby="archives-title">
            <div className="flex flex-col mb-16 relative">
              <h2 id="archives-title" className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter mb-3 opacity-90">THE_ARCHIVES</h2>
              <div className="flex items-center gap-3">
                <div className={`h-[1.5px] w-20 ${currentTheme.bg.replace('10', '100')}`} aria-hidden="true" />
                <span className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-500">FRAGMENTED_SOLUTIONS // {currentTheme.tagline}</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {!isLoaded ? (
                <div className="col-span-full py-16 text-center font-mono text-[9px] uppercase tracking-[0.4em] text-slate-600 animate-pulse">
                  Synchronizing_Neural_Archives...
                </div>
              ) : (
                filteredProjects.map(p => (
                  <ProjectCard key={p.id} project={p} theme={currentTheme} onDivine={divineRelic} isAnalyzed={isAnalyzing === p.id} lore={relicLore[p.id]} uiSettings={uiSettings} />
                ))
              )}
            </div>
          </section>

          <ContactTerminal identity={identity} theme={currentTheme} socialLinks={socialLinks} />

          <EditableAsset assetId="identity-metrics" defaultPosition={{ x: 0, y: 0 }}>
            <IdentityMetrics theme={currentTheme} identity={identity} />
          </EditableAsset>

          <EditableAsset assetId="system-monitoring" defaultPosition={{ x: 0, y: 0 }}>
            <SystemMonitoring theme={currentTheme} identity={identity} />
          </EditableAsset>
        </main>

        <footer className="py-16 text-center border-t border-white/5 bg-black/40 relative z-20" role="contentinfo">
          <p className="text-[9px] uppercase tracking-[0.8em] text-slate-500">Neural_Bridge_Stable // SPECTOR_SYSTEM_v4.2 // Sector_004</p>
        </footer>
      </div>
    </LayoutProvider>
  );
};

export default App;
