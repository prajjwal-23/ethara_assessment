/**
 * Loading spinner component.
 * Displays a shimmer skeleton layout while content loads.
 */

interface LoadingSpinnerProps {
    message?: string;
}

export default function LoadingSpinner({ message }: LoadingSpinnerProps) {
    return (
        <div className="animate-fade-in space-y-6">
            {message && (
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-5 h-5 border-2 border-indigo-200 border-t-indigo-500 rounded-full animate-spin" />
                    <p className="text-sm text-slate-400 font-medium">{message}</p>
                </div>
            )}

            {/* Skeleton cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="glass-card-solid rounded-2xl p-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-3 flex-1">
                                <div className="skeleton h-3 w-20" />
                                <div className="skeleton h-7 w-14" />
                            </div>
                            <div className="skeleton w-12 h-12 rounded-xl" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Skeleton table */}
            <div className="glass-card-solid rounded-2xl p-6 space-y-4">
                <div className="skeleton h-4 w-40 mb-2" />
                {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-4">
                        <div className="skeleton w-10 h-10 rounded-full" />
                        <div className="flex-1 space-y-2">
                            <div className="skeleton h-3 w-32" />
                            <div className="skeleton h-2.5 w-48" />
                        </div>
                        <div className="skeleton h-6 w-16 rounded-full" />
                    </div>
                ))}
            </div>
        </div>
    );
}
