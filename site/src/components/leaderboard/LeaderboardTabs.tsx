'use client';

import Link from 'next/link';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui/8bit/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/8bit/table';
import { Badge } from '@/components/ui/8bit/badge';
import { LEADERBOARD_SEGMENTS, NODE_TYPE_LABELS } from '@/lib/constants';
import type { LeaderboardData, LeaderboardEntry } from '@/lib/types';

interface LeaderboardTabsProps {
  data: LeaderboardData;
}

/** Pixel-art rank medal for top 3 */
function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) {
    return (
      <span className="inline-flex items-center justify-center w-8 h-8 text-lg" title="1st">
        <span className="text-yellow-400 drop-shadow-[0_0_6px_rgba(250,204,21,0.8)]">
          {">>>"}
        </span>
      </span>
    );
  }
  if (rank === 2) {
    return (
      <span className="inline-flex items-center justify-center w-8 h-8 text-lg" title="2nd">
        <span className="text-gray-300 drop-shadow-[0_0_4px_rgba(209,213,219,0.6)]">
          {">>"}
        </span>
      </span>
    );
  }
  if (rank === 3) {
    return (
      <span className="inline-flex items-center justify-center w-8 h-8 text-lg" title="3rd">
        <span className="text-amber-600 drop-shadow-[0_0_4px_rgba(217,119,6,0.6)]">
          {">"}
        </span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center justify-center w-8 h-8 text-xs text-muted-foreground">
      {rank}
    </span>
  );
}

const TYPE_BADGE_CLASSES: Record<string, string> = {
  company: 'bg-[#7351cf] border-[#7351cf] text-white',
  product: 'bg-[#10b981] border-[#10b981] text-white',
  person: 'bg-[#f59e0b] border-[#f59e0b] text-white',
};

function TypeBadge({ type }: { type: string }) {
  const label = NODE_TYPE_LABELS[type] ?? type;
  const badgeClasses = TYPE_BADGE_CLASSES[type] ?? 'bg-[#94a3b8] border-[#94a3b8] text-white';

  return (
    <Badge className={`text-[9px] px-1.5 py-0.5 ${badgeClasses}`}>
      {label}
    </Badge>
  );
}

function EntryRow({ entry }: { entry: LeaderboardEntry }) {
  const isTop3 = entry.rank <= 3;
  const isFeatured = entry.featured;

  return (
    <TableRow
      className={
        isFeatured
          ? 'bg-primary/5 shadow-[inset_0_0_20px_rgba(115,81,207,0.15)]'
          : isTop3
            ? 'bg-card/80'
            : ''
      }
    >
      {/* Rank */}
      <TableCell className="w-12 text-center">
        <RankBadge rank={entry.rank} />
      </TableCell>

      {/* Name */}
      <TableCell>
        <div className="flex items-center gap-2">
          <Link
            href={`/graph?focus=${encodeURIComponent(entry.nodeId)}`}
            className="text-xs hover:text-primary transition-colors underline-offset-4 hover:underline"
          >
            {entry.displayName}
          </Link>
          {isFeatured && (
            <span className="text-yellow-400 text-[10px] animate-pulse" title="Featured">
              *
            </span>
          )}
        </div>
      </TableCell>

      {/* Type */}
      <TableCell>
        <TypeBadge type={entry.type} />
      </TableCell>

      {/* Mentions */}
      <TableCell className="text-center text-xs tabular-nums">
        {entry.mention_count}
      </TableCell>

      {/* Articles */}
      <TableCell className="text-center text-xs tabular-nums">
        {entry.article_count}
      </TableCell>

      {/* Connections */}
      <TableCell className="text-center text-xs tabular-nums">
        {entry.degree}
      </TableCell>
    </TableRow>
  );
}

function SegmentTable({ entries }: { entries: LeaderboardEntry[] }) {
  if (entries.length === 0) {
    return (
      <p className="retro text-xs text-muted-foreground text-center py-10">
        No data yet.
      </p>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <Table className="w-full">
        <TableHeader>
          <TableRow>
            <TableHead className="w-12 text-center text-[10px]">#</TableHead>
            <TableHead className="text-[10px]">Name</TableHead>
            <TableHead className="text-[10px]">Type</TableHead>
            <TableHead className="text-center text-[10px]">Mentions</TableHead>
            <TableHead className="text-center text-[10px]">Articles</TableHead>
            <TableHead className="text-center text-[10px]">Connections</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((entry) => (
            <EntryRow key={`${entry.nodeId}-${entry.rank}`} entry={entry} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export function LeaderboardTabs({ data }: LeaderboardTabsProps) {
  return (
    <Tabs defaultValue="products">
      <TabsList className="mb-6 flex-wrap">
        {LEADERBOARD_SEGMENTS.map((seg) => (
          <TabsTrigger key={seg.key} value={seg.key} className="text-xs px-4 py-2">
            {seg.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {LEADERBOARD_SEGMENTS.map((seg) => (
        <TabsContent key={seg.key} value={seg.key}>
          <SegmentTable entries={data.segments[seg.key]} />
        </TabsContent>
      ))}
    </Tabs>
  );
}
