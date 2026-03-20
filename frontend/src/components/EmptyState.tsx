/**
 * Empty state component.
 * Displayed when no data is available.
 */

import type { ReactNode } from 'react';
import { Inbox } from 'lucide-react';

interface EmptyStateProps {
    title: string;
    message?: string;
    action?: ReactNode;
}

export default function EmptyState({ title, message, action }: EmptyStateProps) {
    return (
        <div className="glass-card-solid rounded-2xl p-12 text-center animate-fade-in">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 mb-6 animate-float">
                <Inbox className="w-9 h-9 text-indigo-300" />
            </div>
            <h3 className="text-lg font-semibold text-slate-700 mb-2">{title}</h3>
            {message && <p className="text-sm text-slate-400 mb-6 max-w-sm mx-auto">{message}</p>}
            {action && <div>{action}</div>}
        </div>
    );
}
