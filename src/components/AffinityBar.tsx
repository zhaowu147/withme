import { getAffinityLevel } from '../lib/types';

interface Props {
  affinity: number;
}

export default function AffinityBar({ affinity }: Props) {
  const level = getAffinityLevel(affinity);

  return (
    <div className="px-4 py-3 border-b border-sakura/10 bg-gradient-to-r from-white via-sakura/5 to-white">
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <span className="text-xs text-accent font-medium tracking-wider">{level.name}</span>
          <span className="text-[10px] text-text-muted">Lv.{level.level}</span>
        </div>
        <span className="text-[10px] text-text-muted tabular-nums">{affinity}%</span>
      </div>
      <div className="w-full h-1 bg-washi-dark rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${affinity}%`,
            background: 'linear-gradient(90deg, #f5c6d0, #c75b7a)',
          }}
        />
      </div>
    </div>
  );
}
