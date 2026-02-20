/**
 * Status badge component.
 * Styled badge for attendance status (Present/Absent).
 */

interface StatusBadgeProps {
    status: 'Present' | 'Absent';
}

export default function StatusBadge({ status }: StatusBadgeProps) {
    const styles = {
        Present: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        Absent: 'bg-red-50 text-red-700 border-red-200',
    };

    return (
        <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${styles[status]}`}
        >
            <span
                className={`w-1.5 h-1.5 rounded-full mr-1.5 ${status === 'Present' ? 'bg-emerald-500' : 'bg-red-500'
                    }`}
            ></span>
            {status}
        </span>
    );
}
