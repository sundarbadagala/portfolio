// components/Modal.tsx
'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    header?: React.ReactNode;
    children: React.ReactNode;
    footer?: React.ReactNode;
}

export default function Modal({ isOpen, onClose, header, children, footer }: ModalProps) {
    const [shouldRender, setShouldRender] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    // Handle mount/unmount + animation timing
    useEffect(() => {
        if (isOpen) {
            setShouldRender(true);
            // let it mount first, then trigger transition on next frame
            requestAnimationFrame(() => requestAnimationFrame(() => setIsVisible(true)));
        } else {
            setIsVisible(false);
            const timeout = setTimeout(() => setShouldRender(false), 200); // match duration below
            return () => clearTimeout(timeout);
        }
    }, [isOpen]);

    // Close on Escape
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
        if (isOpen) document.addEventListener('keydown', handleEsc);
        return () => document.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);

    // Lock body scroll
    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    if (!shouldRender) return null;

    return createPortal(
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-200 ease-out ${isVisible ? 'opacity-100' : 'opacity-0'
                }`}
            onClick={onClose}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

            {/* Modal box */}
            <div
                onClick={(e) => e.stopPropagation()}
                className={`relative w-full max-w-xl rounded-2xl bg-[var(--background)] shadow-xl border border-gray-200 dark:border-gray-800 transition-all duration-200 ease-out ${isVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'}`}
            >
                {/* Header */}
                <div className="flex items-center !justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800">
                    <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {header}
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-full p-1 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
                        aria-label="Close modal"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="px-6 py-5 text-gray-700 dark:text-gray-300 max-h-[60vh] overflow-y-auto">
                    {children}
                </div>

                {/* Footer */}
                {footer && (
                    <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 dark:border-gray-800">
                        {footer}
                    </div>
                )}
            </div>
        </div>,
        document.body
    );
}