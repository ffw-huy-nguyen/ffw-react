import { useState } from 'react';

export const useDragAndDrop = () => {
    const [dragActive, setDragActive] = useState(false);

    const handleDrag = function (e: React.DragEvent<HTMLDivElement>) {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = function (e: React.DragEvent<HTMLDivElement>) {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        return e.dataTransfer.files[0] as File;
    };

    return {
        dragActive,
        handleDrag,
        handleDrop,
    };
};
