import React from 'react';

const Welcome: React.FC = () => {
    return (
        <section
            className="relative py-24 px-8 text-center animate-in fade-in duration-200"
            aria-labelledby="welcome-title"
        >
            <div className="max-w-3xl mx-auto space-y-4">
                <p className="text-[9px] uppercase tracking-[0.4em] text-slate-600 font-medium">
                    WELCOME
                </p>

                <h1
                    id="welcome-title"
                    className="text-4xl md:text-5xl font-black text-white tracking-tight"
                >
                    I'm Moon Knight
                </h1>

                <p className="text-base text-slate-400 font-medium">
                    Frontend Developer & System Builder
                </p>

                <div className="pt-2">
                    <p className="text-[10px] text-slate-500 tracking-[0.3em] uppercase font-medium">
                        Soldier · Scholar · Executioner
                    </p>
                </div>
            </div>
        </section>
    );
};

export default React.memo(Welcome);
