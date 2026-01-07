import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useLayout } from '../../contexts/LayoutContext';

interface EditableAssetProps {
    assetId: string;
    children: React.ReactNode;
    defaultPosition?: { x: number; y: number };
    defaultSize?: { width: number | string; height: number | string };
    minWidth?: number;
    minHeight?: number;
}

const GRID_SIZE = 16;

const snapToGrid = (value: number): number => {
    return Math.round(value / GRID_SIZE) * GRID_SIZE;
};

const EditableAsset: React.FC<EditableAssetProps> = ({
    assetId,
    children,
    defaultPosition = { x: 0, y: 0 },
    defaultSize = { width: 'auto', height: 'auto' },
    minWidth = 200,
    minHeight = 100
}) => {
    const { layoutConfig, isEditMode, updateLayout } = useLayout();
    const elementRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const [resizeHandle, setResizeHandle] = useState<string | null>(null);
    const dragStartRef = useRef<{ x: number; y: number; offsetX: number; offsetY: number } | null>(null);
    const resizeStartRef = useRef<{ x: number; y: number; width: number; height: number } | null>(null);

    // Get current layout or use defaults
    const currentLayout = layoutConfig[assetId] || {
        x: defaultPosition.x,
        y: defaultPosition.y,
        width: defaultSize.width,
        height: defaultSize.height
    };

    // Handle drag start
    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        if (!isEditMode || isResizing) return;

        e.preventDefault();
        const rect = elementRef.current?.getBoundingClientRect();
        if (!rect) return;

        setIsDragging(true);
        dragStartRef.current = {
            x: e.clientX,
            y: e.clientY,
            offsetX: e.clientX - rect.left,
            offsetY: e.clientY - rect.top
        };
    }, [isEditMode, isResizing]);

    // Handle resize start
    const handleResizeMouseDown = useCallback((e: React.MouseEvent, handle: string) => {
        if (!isEditMode) return;

        e.preventDefault();
        e.stopPropagation();

        const rect = elementRef.current?.getBoundingClientRect();
        if (!rect) return;

        setIsResizing(true);
        setResizeHandle(handle);
        resizeStartRef.current = {
            x: e.clientX,
            y: e.clientY,
            width: rect.width,
            height: rect.height
        };
    }, [isEditMode]);

    // Handle mouse move
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (isDragging && dragStartRef.current) {
                const newX = snapToGrid(e.clientX - dragStartRef.current.offsetX);
                const newY = snapToGrid(e.clientY - dragStartRef.current.offsetY);

                updateLayout(assetId, {
                    ...currentLayout,
                    x: Math.max(0, newX),
                    y: Math.max(0, newY)
                });
            }

            if (isResizing && resizeStartRef.current && resizeHandle) {
                const deltaX = e.clientX - resizeStartRef.current.x;
                const deltaY = e.clientY - resizeStartRef.current.y;

                let newWidth = resizeStartRef.current.width;
                let newHeight = resizeStartRef.current.height;
                let newX = currentLayout.x;
                let newY = currentLayout.y;

                // Handle different resize directions
                if (resizeHandle.includes('e')) {
                    newWidth = Math.max(minWidth, resizeStartRef.current.width + deltaX);
                }
                if (resizeHandle.includes('w')) {
                    const widthDiff = resizeStartRef.current.width - deltaX;
                    if (widthDiff >= minWidth) {
                        newWidth = widthDiff;
                        newX = snapToGrid(currentLayout.x + deltaX);
                    }
                }
                if (resizeHandle.includes('s')) {
                    newHeight = Math.max(minHeight, resizeStartRef.current.height + deltaY);
                }
                if (resizeHandle.includes('n')) {
                    const heightDiff = resizeStartRef.current.height - deltaY;
                    if (heightDiff >= minHeight) {
                        newHeight = heightDiff;
                        newY = snapToGrid(currentLayout.y + deltaY);
                    }
                }

                updateLayout(assetId, {
                    x: newX,
                    y: newY,
                    width: snapToGrid(newWidth),
                    height: snapToGrid(newHeight)
                });
            }
        };

        const handleMouseUp = () => {
            setIsDragging(false);
            setIsResizing(false);
            setResizeHandle(null);
            dragStartRef.current = null;
            resizeStartRef.current = null;
        };

        if (isDragging || isResizing) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
            return () => {
                window.removeEventListener('mousemove', handleMouseMove);
                window.removeEventListener('mouseup', handleMouseUp);
            };
        }
    }, [isDragging, isResizing, resizeHandle, assetId, currentLayout, updateLayout, minWidth, minHeight]);

    const style: React.CSSProperties = {
        position: isEditMode || layoutConfig[assetId] ? 'absolute' : 'relative',
        left: currentLayout.x,
        top: currentLayout.y,
        width: currentLayout.width,
        height: currentLayout.height,
        cursor: isEditMode ? (isDragging ? 'grabbing' : 'grab') : 'default',
        transition: isEditMode ? 'none' : 'all 0.3s ease',
        outline: isEditMode ? '2px dashed rgba(59, 130, 246, 0.5)' : 'none',
        zIndex: isDragging || isResizing ? 1000 : 'auto'
    };

    const resizeHandles = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'];

    const getResizeCursor = (handle: string): string => {
        const cursors: { [key: string]: string } = {
            'nw': 'nwse-resize',
            'n': 'ns-resize',
            'ne': 'nesw-resize',
            'e': 'ew-resize',
            'se': 'nwse-resize',
            's': 'ns-resize',
            'sw': 'nesw-resize',
            'w': 'ew-resize'
        };
        return cursors[handle] || 'default';
    };

    const getHandlePosition = (handle: string): React.CSSProperties => {
        const size = 8;
        const positions: { [key: string]: React.CSSProperties } = {
            'nw': { top: -size / 2, left: -size / 2 },
            'n': { top: -size / 2, left: '50%', transform: 'translateX(-50%)' },
            'ne': { top: -size / 2, right: -size / 2 },
            'e': { top: '50%', right: -size / 2, transform: 'translateY(-50%)' },
            'se': { bottom: -size / 2, right: -size / 2 },
            's': { bottom: -size / 2, left: '50%', transform: 'translateX(-50%)' },
            'sw': { bottom: -size / 2, left: -size / 2 },
            'w': { top: '50%', left: -size / 2, transform: 'translateY(-50%)' }
        };
        return positions[handle] || {};
    };

    return (
        <div
            ref={elementRef}
            style={style}
            onMouseDown={handleMouseDown}
            data-asset-id={assetId}
        >
            {children}

            {isEditMode && resizeHandles.map(handle => (
                <div
                    key={handle}
                    onMouseDown={(e) => handleResizeMouseDown(e, handle)}
                    style={{
                        position: 'absolute',
                        width: 8,
                        height: 8,
                        backgroundColor: 'white',
                        border: '2px solid rgb(59, 130, 246)',
                        cursor: getResizeCursor(handle),
                        ...getHandlePosition(handle)
                    }}
                />
            ))}
        </div>
    );
};

export default React.memo(EditableAsset);
