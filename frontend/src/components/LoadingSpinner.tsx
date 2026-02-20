/**
 * Loading spinner component.
 * Displays a centered spinner with optional message.
 */

interface LoadingSpinnerProps {
    message?: string;
}

export default function LoadingSpinner({ message = 'Loading...' }: LoadingSpinnerProps) {
    return (
        <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
            <div className="relative">
                <div className="w-12 h-12 rounded-full border-4 border-indigo-100"></div>
                <div className="w-12 h-12 rounded-full border-4 border-transparent border-t-indigo-500 animate-spin absolute top-0 left-0"></div>
            </div>
            <p className="mt-4 text-sm text-slate-500 font-medium">{message}</p>
        </div>
    );
}
