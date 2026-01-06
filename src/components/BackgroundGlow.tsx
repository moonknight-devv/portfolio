import React, { useState, useEffect, useRef } from 'react';

interface BackgroundGlowProps {
    color: string;
    intensity: number;
}

const BackgroundGlow: React.FC<BackgroundGlowProps> = ({ color, intensity }) => {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const requestRef = useRef<number | undefined>(undefined);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (requestRef.current !== undefined) return;

            requestRef.current = requestAnimationFrame(() => {
                setMousePos({ x: e.clientX, y: e.clientY });
                requestRef.current = undefined;
            });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            if (requestRef.current !== undefined) cancelAnimationFrame(requestRef.current);
        };
    }, []);

    return (
        <div
            className="fixed inset-0 pointer-events-none transition-all duration-[1.5s] z-0"
            style={{
                background: `radial-gradient(circle at ${mousePos.x}px ${mousePos.y}px, ${color}${intensity / 100}) 0%, transparent 60%)`
            }}
        />
    );
};

export default React.memo(BackgroundGlow);
