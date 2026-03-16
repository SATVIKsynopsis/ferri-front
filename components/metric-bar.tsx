'use client';

export default function MetricBar({
  label,
  value,
  comparison,
  percent,
  color,
}: {
  label: string;
  value: string;
  comparison: string;
  percent: number;
  color: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div>
          <div className="text-sm font-semibold">{label}</div>
          <div className="text-xs text-muted-foreground">{comparison}</div>
        </div>
        <div className="text-lg font-bold text-primary">{value}</div>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${color} to-transparent transition-all duration-700`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
