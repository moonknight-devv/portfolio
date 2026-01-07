import React, { useRef, useState, Suspense, useCallback, useEffect } from 'react';
import { Activity, ChevronRight, Github, ExternalLink } from 'lucide-react';
import type { Project, Theme, UiSettings } from '../../data/types';

const LoreOverlay = React.lazy(() => import('../LoreOverlay'));

interface ProjectCardProps {
    project: Project;
    theme: Theme;
    onDivine: (project: Project | null) => void;
    isAnalyzed: boolean;
    lore: string | undefined;
    uiSettings: UiSettings;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, theme, onDivine, isAnalyzed, lore, uiSettings }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [rotate, setRotate] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);
    const requestRef = useRef<number | undefined>(undefined);

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (!cardRef.current || requestRef.current) return;

        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const xc = rect.width / 2;
        const yc = rect.height / 2;
        const dx = x - xc;
        const dy = y - yc;

        requestRef.current = requestAnimationFrame(() => {
            setRotate({ x: dy / 10, y: -dx / 10 });
            requestRef.current = undefined;
        });
    }, []);

    useEffect(() => {
        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, []);

    return (
        <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => {
                setIsHovered(false);
                if (requestRef.current) cancelAnimationFrame(requestRef.current);
                requestRef.current = undefined;
                setRotate({ x: 0, y: 0 });
            }}
            style={{
                transform: `perspective(1000px) rotateX(${rotate.x * 0.3}deg) rotateY(${rotate.y * 0.3}deg) scale(${isHovered ? 1.01 : 1})`,
                transition: isHovered ? 'transform 0.1s ease-out' : 'all 0.2s cubic-bezier(0.23, 1, 0.32, 1)',
                backgroundColor: `rgba(255, 255, 255, ${uiSettings.glassOpacity / 100})`
            }}
            className={`group border border-white/[0.05] rounded-[1.5rem] p-8 relative overflow-hidden backdrop-blur-md hover:border-white/20 shadow-2xl flex flex-col min-h-[360px]`}
        >
            {/* Visual Scan Effects */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-10 pointer-events-none z-0 transition-opacity duration-500"
                style={{
                    backgroundImage: `linear-gradient(${theme.glowColor}0.2) 1px, transparent 1px), linear-gradient(90deg, ${theme.glowColor}0.2) 1px, transparent 1px)`,
                    backgroundSize: '20px 20px'
                }}
            />
            <div className="absolute left-0 w-full h-[2px] z-[60] pointer-events-none opacity-0 group-hover:opacity-100 group-hover:animate-scan-laser"
                style={{ background: `linear-gradient(90deg, transparent, white, transparent)`, boxShadow: `0 0 15px 2px ${theme.glowColor}1)` }}
            />

            <div className="relative z-30 flex flex-col h-full">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 bg-white/[0.03] transition-all duration-200 border border-white/[0.05] group-hover:scale-105 relative ${isAnalyzed ? `${theme.bg} ${theme.color} ${theme.border}` : ''}`}>
                    {isAnalyzed ? <Activity className="w-5 h-5 animate-pulse" /> : project.icon}
                </div>

                <div className="relative">
                    <h3 className="text-2xl font-black mb-2 uppercase tracking-tighter text-white group-hover:translate-x-1 transition-transform duration-200">
                        {project.title}
                    </h3>
                    <p className="text-slate-600 text-[9px] uppercase tracking-[0.3em] mb-8 font-black italic">
                        {project.tech}
                    </p>

                    <div className="space-y-3 mb-8">
                        {Object.entries(project.stats).map(([label, val], idx) => (
                            <div
                                key={label}
                                style={{ transitionDelay: `${idx * 50}ms` }}
                                className="flex justify-between items-center border-b border-white/[0.03] pb-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-200"
                            >
                                <span className="text-[8px] uppercase text-slate-500 font-black tracking-widest">{label}</span>
                                <span className={`text-[10px] font-mono font-black ${theme.color}`}>{val}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex items-center justify-between mt-auto pt-6 border-t border-white/[0.05]">
                    <button
                        onClick={() => onDivine(project)}
                        aria-label={lore ? `Dismiss lore for ${project.title}` : `Analyze data for ${project.title}`}
                        className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] ${theme.color} hover:gap-4 transition-all focus:outline-white/20 rounded-lg p-1`}
                    >
                        {lore ? 'SYSTEM_ACTIVE' : 'COMMUNE'} <ChevronRight className="w-3 h-3" aria-hidden="true" />
                    </button>
                    <nav className="flex gap-5 text-slate-500" aria-label={`Links for ${project.title}`}>
                        <a href="#" aria-label={`View ${project.title} on GitHub`} className="hover:text-white transition-colors focus:outline-white/20 rounded-lg">
                            <Github className="w-5 h-5" aria-hidden="true" />
                        </a>
                        <a href="#" aria-label={`Visit live site for ${project.title}`} className="hover:text-white transition-colors focus:outline-white/20 rounded-lg">
                            <ExternalLink className="w-5 h-5" aria-hidden="true" />
                        </a>
                    </nav>
                </div>
            </div>

            <Suspense fallback={null}>
                {lore && <LoreOverlay theme={theme} lore={lore} onDismiss={(e) => { e.stopPropagation(); onDivine(null); }} />}
            </Suspense>
        </div>
    );
};

export default React.memo(ProjectCard);
