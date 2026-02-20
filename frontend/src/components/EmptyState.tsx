/**
 * Empty state component.
 * Shown when no data is available for a table or list.
 */

import { Inbox } from 'lucide-react';
import type { ReactNode } from 'react';

interface EmptyStateProps {
    title: string;
    message: string;
    action?: ReactNode;
}

export default function EmptyState({ title, message, action }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                <Inbox className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-700">{title}</h3>
            <p className="mt-1 text-sm text-slate-500 max-w-sm text-center">{message}</p>
            {action && <div className="mt-6">{action}</div>}
        </div>
    );
}
