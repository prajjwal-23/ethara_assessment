/**
 * Confirm modal component.
 * Used for delete confirmation and other destructive actions.
 */

import { AlertTriangle } from 'lucide-react';

interface ConfirmModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    onConfirm: () => void;
    onCancel: () => void;
    isLoading?: boolean;
}

export default function ConfirmModal({
    isOpen,
    title,
    message,
    confirmLabel = 'Delete',
    onConfirm,
    onCancel,
    isLoading = false,
}: ConfirmModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={onCancel}
            ></div>

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-fade-in">
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
                        <AlertTriangle className="w-6 h-6 text-red-500" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
                        <p className="mt-1 text-sm text-slate-500">{message}</p>
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                    <button
                        onClick={onCancel}
                        disabled={isLoading}
                        className="px-4 py-2.5 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-smooth disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="px-4 py-2.5 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-xl transition-smooth shadow-lg shadow-red-500/25 disabled:opacity-50 flex items-center gap-2"
                    >
                        {isLoading && (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        )}
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}
