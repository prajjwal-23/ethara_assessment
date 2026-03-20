/**
 * Error alert component.
 * Glassmorphic error card with retry button.
 */

import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorAlertProps {
    message: string;
    onRetry?: () => void;
}

export default function ErrorAlert({ message, onRetry }: ErrorAlertProps) {
    return (
        <div className="glass-card-solid rounded-2xl p-8 border-l-4 border-rose-400 animate-scale-in">
            <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-rose-50 flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-5 h-5 text-rose-500" />
                </div>
                <div className="flex-1">
                    <h3 className="text-sm font-semibold text-slate-800 mb-1">Something went wrong</h3>
                    <p className="text-sm text-slate-500">{message}</p>
                    {onRetry && (
                        <button
                            onClick={onRetry}
                            className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl transition-smooth"
                        >
                            <RefreshCw className="w-3.5 h-3.5" />
                            Try again
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
