/**
 * Status badge component.
 * Glowing dot indicator for Present/Absent status.
 */

interface StatusBadgeProps {
    status: string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
    const isPresent = status === 'Present';

    return (
        <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${
            isPresent
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-rose-50 text-rose-700'
        }`}>
            <span className={`w-2 h-2 rounded-full animate-pulse-dot ${
                isPresent ? 'bg-emerald-500' : 'bg-rose-500'
            }`} />
            {status}
        </span>
    );
}
