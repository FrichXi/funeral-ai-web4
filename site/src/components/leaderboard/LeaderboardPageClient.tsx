'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { LEADERBOARD_SEGMENTS, SPONSORS_DATA } from '@/lib/constants';
import { SegmentTable } from '@/components/leaderboard/LeaderboardTabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/8bit/table';
import type {
  LeaderboardData,
  LeaderboardSegment,
  SponsorIconVariant,
  SponsorTrailingVariant,
  SponsorThemeVariant,
} from '@/lib/types';

const PIXEL_ICON_SPECS: Record<
  SponsorIconVariant,
  {
    width: number;
    height: number;
    pixelSize: number;
    color: string;
    glow: string;
    pixels: Array<[number, number]>;
  }
> = {
  'supreme-crown': {
    width: 7,
    height: 4,
    pixelSize: 3,
    color: '#fde047',
    glow: 'rgba(253, 224, 71, 0.7)',
    pixels: [
      [0, 1], [1, 0], [2, 1], [3, 0], [4, 1], [5, 0], [6, 1],
      [0, 2], [1, 2], [2, 2], [3, 2], [4, 2], [5, 2], [6, 2],
      [1, 3], [2, 3], [3, 3], [4, 3], [5, 3],
    ],
  },
  gem: {
    width: 5,
    height: 5,
    pixelSize: 3,
    color: '#facc15',
    glow: 'rgba(250, 204, 21, 0.65)',
    pixels: [
      [2, 0],
      [1, 1], [2, 1], [3, 1],
      [0, 2], [1, 2], [2, 2], [3, 2], [4, 2],
      [1, 3], [2, 3], [3, 3],
      [2, 4],
    ],
  },
  'triple-crown': {
    width: 7,
    height: 3,
    pixelSize: 3,
    color: '#f59e0b',
    glow: 'rgba(245, 158, 11, 0.5)',
    pixels: [
      [1, 0], [3, 1], [5, 0],
      [0, 1], [1, 1], [2, 1], [4, 1], [5, 1], [6, 1],
      [0, 2], [1, 2], [2, 2], [3, 2], [4, 2], [5, 2], [6, 2],
    ],
  },
  'legacy-primary': {
    width: 7,
    height: 3,
    pixelSize: 3,
    color: '#e9d5ff',
    glow: 'rgba(168, 85, 247, 0.45)',
    pixels: [
      [0, 0], [3, 1], [6, 0],
      [0, 1], [1, 1], [2, 1], [4, 1], [5, 1], [6, 1],
      [0, 2], [1, 2], [2, 2], [3, 2], [4, 2], [5, 2], [6, 2],
    ],
  },
  'legacy-secondary': {
    width: 7,
    height: 4,
    pixelSize: 3,
    color: '#c4b5fd',
    glow: 'rgba(139, 92, 246, 0.4)',
    pixels: [
      [1, 0], [5, 0],
      [0, 1], [1, 1], [3, 1], [5, 1], [6, 1],
      [0, 2], [1, 2], [2, 2], [3, 2], [4, 2], [5, 2], [6, 2],
      [1, 3], [2, 3], [3, 3], [4, 3], [5, 3],
    ],
  },
  'double-crown': {
    width: 5,
    height: 2,
    pixelSize: 3,
    color: '#9b7de8',
    glow: 'rgba(155, 125, 232, 0.45)',
    pixels: [
      [0, 0], [2, 0], [4, 0],
      [0, 1], [1, 1], [2, 1], [3, 1], [4, 1],
    ],
  },
  'single-crown': {
    width: 5,
    height: 3,
    pixelSize: 3,
    color: '#94a3b8',
    glow: 'rgba(148, 163, 184, 0.35)',
    pixels: [
      [2, 0],
      [1, 1], [2, 1], [3, 1],
      [0, 2], [1, 2], [2, 2], [3, 2], [4, 2],
    ],
  },
};

const SPONSOR_THEME_STYLES: Record<
  SponsorThemeVariant,
  {
    rowClass: string;
    titleClass: string;
    nameClass: string;
    karmaClass: string;
    badgeClass: string;
    trailingTextClass: string;
  }
> = {
  'supreme-gold': {
    rowClass: '!border-[#fde047]/90 !bg-[#fde047]/12 hover:!bg-[#fde047]/22',
    titleClass: 'text-[#fde047]',
    nameClass: 'text-[#fef9c3]',
    karmaClass: 'text-[#fde047]',
    badgeClass: 'border-[#fde047]/80 bg-[#fde047]/20 text-[#fef9c3]',
    trailingTextClass: 'text-[#fef9c3]',
  },
  'top-gold': {
    rowClass: '!border-[#facc15]/80 !bg-[#facc15]/10 hover:!bg-[#facc15]/20',
    titleClass: 'text-[#facc15]',
    nameClass: 'text-[#fef3c7]',
    karmaClass: 'text-[#facc15]',
    badgeClass: 'border-[#facc15]/80 bg-[#facc15]/20 text-[#fef3c7]',
    trailingTextClass: 'text-[#fef3c7]',
  },
  'high-gold': {
    rowClass: '!border-[#f59e0b]/60 !bg-[#f59e0b]/10 hover:!bg-[#f59e0b]/20',
    titleClass: 'text-[#fbbf24]',
    nameClass: 'text-[#fde68a]',
    karmaClass: 'text-[#fbbf24]',
    badgeClass: 'border-[#f59e0b]/60 bg-[#f59e0b]/20 text-[#fde68a]',
    trailingTextClass: 'text-[#fde68a]',
  },
  'legacy-primary': {
    rowClass: '!border-[#9b7de8]/60 !bg-[#7351cf]/10 hover:!bg-[#7351cf]/20',
    titleClass: 'text-[#9b7de8]',
    nameClass: 'text-[#f5e9ff]',
    karmaClass: 'text-[#e9d5ff]',
    badgeClass: 'border-[#9b7de8]/60 bg-[#7351cf]/20 text-[#f5e9ff]',
    trailingTextClass: 'text-[#f5e9ff]',
  },
  'legacy-secondary': {
    rowClass: '!border-[#c4b5fd]/50 !bg-[#6d5aa8]/10 hover:!bg-[#6d5aa8]/20',
    titleClass: 'text-[#c4b5fd]',
    nameClass: 'text-[#f1ebff]',
    karmaClass: 'text-[#ddd6fe]',
    badgeClass: 'border-[#c4b5fd]/60 bg-[#6d5aa8]/20 text-[#f1ebff]',
    trailingTextClass: 'text-[#f1ebff]',
  },
  guardian: {
    rowClass: '',
    titleClass: 'text-primary',
    nameClass: 'text-foreground',
    karmaClass: 'text-[#facc15]',
    badgeClass: 'border-border/40 bg-transparent text-transparent',
    trailingTextClass: 'text-foreground',
  },
  supporter: {
    rowClass: '',
    titleClass: 'text-muted-foreground',
    nameClass: 'text-foreground',
    karmaClass: 'text-[#facc15]',
    badgeClass: 'border-border/40 bg-transparent text-transparent',
    trailingTextClass: 'text-muted-foreground',
  },
};

const MOBILE_SPONSOR_TITLE_LABELS: Record<string, string> = {
  '葬爱Web4万古至尊金主': '万古至尊',
  '葬爱Web4至高无上功德主': '至高无上',
  '葬爱Web4无上功德主': '无上功德',
  '葬爱Web4大功德主': '大功德',
  '葬爱Web4护法金主': '护法',
  '葬爱Web4随喜功德主': '随喜',
};

function getMobileSponsorTitle(title: string) {
  return MOBILE_SPONSOR_TITLE_LABELS[title] ?? title.replace(/^葬爱Web4/, '');
}

function SponsorTrailingLabel({
  label,
  variant,
  theme,
}: {
  label?: string;
  variant?: SponsorTrailingVariant;
  theme: (typeof SPONSOR_THEME_STYLES)[SponsorThemeVariant];
}) {
  if (!label) {
    return <span aria-hidden="true" className="block h-4" />;
  }

  if (variant === 'plain') {
    return (
      <span
        className={cn(
          'block whitespace-nowrap text-right text-[13px] font-normal leading-none md:text-sm',
          theme.trailingTextClass
        )}
      >
        {label}
      </span>
    );
  }

  return (
    <span
      className={cn(
        'inline-flex h-5 items-center justify-end justify-self-end rounded-sm border px-1.5 text-[10px] leading-none tracking-[0.18em]',
        theme.badgeClass
      )}
    >
      {label}
    </span>
  );
}

function PixelRankIcon({ variant }: { variant: SponsorIconVariant }) {
  const spec = PIXEL_ICON_SPECS[variant];
  const p = spec.pixelSize;
  return (
    <span
      className="inline-flex items-center justify-center align-middle"
      aria-hidden="true"
      style={{ width: spec.width * p, height: spec.height * p }}
    >
      <span
        className="relative"
        style={{
          width: p,
          height: p,
          backgroundColor: 'transparent',
          boxShadow: spec.pixels
            .map(([x, y]) => `${x * p}px ${y * p}px 0 ${spec.color}`)
            .join(', '),
          filter: `drop-shadow(0 0 4px ${spec.glow})`,
        }}
      />
    </span>
  );
}

function SponsorTable() {
  return (
    <Table className="text-xs md:text-sm" layout="intrinsic" align="center">
      <TableHeader>
        <TableRow>
          <TableHead className="w-14 text-center text-[10px] md:text-xs">徽记</TableHead>
          <TableHead className="text-[10px] md:text-xs">Name</TableHead>
          <TableHead className="text-right text-[10px] md:text-xs">功德</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {SPONSORS_DATA.map((s) => {
          const theme = SPONSOR_THEME_STYLES[s.themeVariant];

          return (
            <TableRow key={s.id} className={theme.rowClass}>
              <TableCell className="w-14 text-center">
                <PixelRankIcon variant={s.iconVariant} />
              </TableCell>
              <TableCell className="whitespace-normal">
                <div className="grid grid-cols-[14rem_minmax(0,1fr)] items-baseline gap-x-3 text-[13px] font-bold leading-5 md:grid-cols-[14.5rem_minmax(0,1fr)] md:text-sm">
                  <span className={cn('whitespace-nowrap', theme.titleClass)}>{s.title}</span>
                  <span className={cn('min-w-0 whitespace-nowrap', theme.nameClass)}>{s.name}</span>
                </div>
              </TableCell>
              <TableCell className="min-w-[14rem]">
                <div className="grid grid-cols-[4.5rem_8.75rem] items-center gap-2.5">
                  <span className={cn('text-right tabular-nums', theme.karmaClass)}>{s.karma}</span>
                  <SponsorTrailingLabel
                    label={s.trailingLabel}
                    variant={s.trailingLabelVariant}
                    theme={theme}
                  />
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

function SponsorMobileList() {
  return (
    <div className="retro relative border-y-6 border-foreground px-4 py-2 text-xs dark:border-ring">
      <div
        className="pointer-events-none absolute inset-0 -mx-1.5 border-x-6 border-foreground dark:border-ring"
        aria-hidden="true"
      />
      <div className="relative grid grid-cols-[2rem_minmax(0,1fr)_4.5rem] items-center border-b-4 border-foreground pb-2 text-[10px] text-muted-foreground dark:border-ring">
        <span className="text-center">徽记</span>
        <span>Name</span>
        <span className="text-right">功德</span>
      </div>
      <div className="relative">
        {SPONSORS_DATA.map((s, index) => {
          const theme = SPONSOR_THEME_STYLES[s.themeVariant];
          const showLegacyBadge = Boolean(
            s.trailingLabel && s.trailingLabelVariant === 'badge'
          );

          return (
            <div
              key={s.id}
              className={cn(
                'grid grid-cols-[2rem_minmax(0,1fr)_4.5rem] items-start gap-x-2 border-b-4 border-dashed border-foreground px-0 py-2 dark:border-ring',
                theme.rowClass,
                index === SPONSORS_DATA.length - 1 && 'border-b-0'
              )}
            >
              <div className="flex justify-center pt-0.5">
                <PixelRankIcon variant={s.iconVariant} />
              </div>
              <div className="min-w-0">
                <div className={cn('text-[10px] leading-none', theme.titleClass)}>
                  {getMobileSponsorTitle(s.title)}
                </div>
                <div
                  className={cn('mt-1 truncate text-[13px] font-bold leading-4', theme.nameClass)}
                  title={s.name}
                >
                  {s.name}
                </div>
                {showLegacyBadge ? (
                  <span
                    className={cn(
                      'mt-1 inline-flex h-4 items-center rounded-sm border px-1 text-[8px] leading-none tracking-[0.12em]',
                      theme.badgeClass
                    )}
                  >
                    {s.trailingLabel}
                  </span>
                ) : null}
              </div>
              <div className="pt-0.5 text-right">
                <div
                  className={cn(
                    'whitespace-nowrap text-[13px] font-bold leading-4 tabular-nums',
                    theme.karmaClass
                  )}
                >
                  {s.karma}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SegmentNavigation({
  activeTab,
  onSelect,
  className,
}: {
  activeTab: LeaderboardSegment;
  onSelect: (segment: LeaderboardSegment) => void;
  className?: string;
}) {
  return (
    <div className={cn('flex flex-wrap items-baseline gap-x-6 gap-y-2', className)}>
      {LEADERBOARD_SEGMENTS.map((seg) => (
        <button
          key={seg.key}
          onClick={() => onSelect(seg.key)}
          className={cn(
            'retro text-[24px] transition-colors',
            activeTab === seg.key
              ? 'text-primary'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          {seg.label}
        </button>
      ))}
    </div>
  );
}

export function LeaderboardPageClient({ data }: { data: LeaderboardData }) {
  const [activeTab, setActiveTab] = useState<LeaderboardSegment>('products');

  return (
    <section>
      <div className="space-y-8 lg:hidden">
        <div>
          <h2 className="retro mb-4 text-[24px] text-[#facc15]">功德榜</h2>
          <SponsorMobileList />
        </div>

        <SegmentNavigation activeTab={activeTab} onSelect={setActiveTab} />

        <div className="min-w-0">
          <SegmentTable entries={data.segments[activeTab]} />
        </div>
      </div>

      <div className="hidden lg:grid lg:grid-cols-[minmax(0,1fr)_max-content] lg:items-start lg:gap-x-10 lg:gap-y-6 xl:gap-x-12 2xl:grid-cols-[max-content_max-content] 2xl:justify-center 2xl:gap-x-20">
        <div className="min-w-0">
          <SegmentNavigation activeTab={activeTab} onSelect={setActiveTab} />
        </div>

        <div className="justify-self-center">
          <h2 className="retro text-center text-[24px] text-[#facc15]">功德榜</h2>
        </div>

        <div className="min-w-0">
          <SegmentTable entries={data.segments[activeTab]} />
        </div>

        <aside>
          <SponsorTable />
        </aside>
      </div>
    </section>
  );
}
