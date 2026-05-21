import { getAffinityLevel } from '../lib/types';

interface Props {
  affinity: number;
}

export default function AffinityBar({ affinity }: Props) {
  const level = getAffinityLevel(affinity);

  return (
    <div className="px-4 py-3 border-b border-washi-dark bg-washi/80 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-text-muted tracking-wider">{level.name}</span>
        <span className="text-xs text-text-muted">{affinity}%</span>
      </div>
      <div className="w-full h-1.5 bg-washi-dark rounded-full overflow-hidden">
        <div
          className="h-full bg-accent rounded-full transition-all duration-700 ease-out"
          style={{ width: `${affinity}%` }}
        />
      </div>
    </div>
  );
}
