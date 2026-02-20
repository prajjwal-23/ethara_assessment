/**
 * Error alert component.
 * Displays an error message with retry option.
 */

import { AlertTriangle } from 'lucide-react';

interface ErrorAlertProps {
    message: string;
    onRetry?: () => void;
}

export default function ErrorAlert({ message, onRetry }: ErrorAlertProps) {
    return (
        <div className="flex flex-col items-center justify-center py-12 animate-fade-in">
            <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mb-4">
                <AlertTriangle className="w-7 h-7 text-red-500" />
            </div>
            <h3 className="text-lg font-semibold text-slate-700">Something went wrong</h3>
            <p className="mt-1 text-sm text-slate-500 text-center max-w-md">{message}</p>
            {onRetry && (
                <button
                    onClick={onRetry}
                    className="mt-4 px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-xl transition-smooth shadow-lg shadow-red-500/25"
                >
                    Try Again
                </button>
            )}
        </div>
    );
}
