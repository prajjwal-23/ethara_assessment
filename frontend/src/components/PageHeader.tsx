/**
 * Page header component.
 * Gradient text titles with optional action buttons.
 */

import type { ReactNode } from 'react';

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    action?: ReactNode;
}

export default function PageHeader({ title, subtitle, action }: PageHeaderProps) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
            <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold gradient-text-subtle tracking-tight">
                    {title}
                </h1>
                {subtitle && (
                    <p className="text-sm text-slate-400 mt-1.5 font-medium">{subtitle}</p>
                )}
            </div>
            {action && <div className="flex-shrink-0">{action}</div>}
        </div>
    );
}
