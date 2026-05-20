import type {
  RelationType,
  NodeType,
  SponsorLeaderboardEntry,
  SponsorRecord,
} from './types';

// ── Brand colors ──
export const BRAND = {
  purple: '#7351cf',
  purpleLight: '#9b7de8',
  purpleDark: '#5438a0',
  pink: '#f5a0b8',
  pinkDark: '#d97090',
} as const;

// ── Node type registry (single source of truth) ──
export const NODE_TYPE_REGISTRY: Record<NodeType, {
  color: string;
  label: string;
  badgeClass: string;
}> = {
  company:  { color: '#7351cf', label: '公司',     badgeClass: 'bg-[#7351cf] border-[#7351cf] text-white' },
  product:  { color: '#10b981', label: '产品',     badgeClass: 'bg-[#10b981] border-[#10b981] text-white' },
  person:   { color: '#f59e0b', label: '人物',     badgeClass: 'bg-[#f59e0b] border-[#f59e0b] text-white' },
  vc_firm:  { color: '#2dd4bf', label: '投资机构', badgeClass: 'bg-[#2dd4bf] border-[#2dd4bf] text-white' },
};

// ── Derived constants (backward compatible) ──
export const NODE_COLORS: Record<string, string> = Object.fromEntries(
  Object.entries(NODE_TYPE_REGISTRY).map(([k, v]) => [k, v.color])
);

export const NODE_TYPE_LABELS: Record<string, string> = Object.fromEntries(
  Object.entries(NODE_TYPE_REGISTRY).map(([k, v]) => [k, v.label])
);

export const NODE_BADGE_CLASSES: Record<string, string> = Object.fromEntries(
  Object.entries(NODE_TYPE_REGISTRY).map(([k, v]) => [k, v.badgeClass])
);

export const ALL_NODE_TYPES = Object.keys(NODE_TYPE_REGISTRY) as NodeType[];

// ── Relation categories & colors ──

export interface RelationStyle {
  color: string;
  lineStyle: 'solid' | 'dashed';
  arrow: boolean;
  category: string;
  label: string;
}

export const RELATION_STYLES: Record<RelationType, RelationStyle> = {
  // structural
  develops:     { color: '#60a5fa', lineStyle: 'solid', arrow: true,  category: '结构', label: '开发' },
  works_on:     { color: '#60a5fa', lineStyle: 'solid', arrow: true,  category: '结构', label: '参与' },
  works_at:     { color: '#60a5fa', lineStyle: 'solid', arrow: true,  category: '结构', label: '就职' },
  // founding
  founder_of:   { color: '#f59e0b', lineStyle: 'solid', arrow: true,  category: '创始', label: '创立' },
  co_founded:   { color: '#f59e0b', lineStyle: 'solid', arrow: true,  category: '创始', label: '联合创立' },
  // investment
  invests_in:   { color: '#a78bfa', lineStyle: 'solid', arrow: true,  category: '投资', label: '投资' },
  acquires:     { color: '#a78bfa', lineStyle: 'solid', arrow: true,  category: '投资', label: '收购' },
  // competition
  competes_with:{ color: '#ef4444', lineStyle: 'dashed', arrow: false, category: '竞争', label: '竞争' },
  compares_to:  { color: '#94a3b8', lineStyle: 'dashed', arrow: false, category: '竞争', label: '对比' },
  // collaboration
  collaborates_with: { color: '#22d3ee', lineStyle: 'solid', arrow: false, category: '合作', label: '合作' },
  partners_with:     { color: '#22d3ee', lineStyle: 'solid', arrow: false, category: '合作', label: '合作伙伴' },
  integrates_with:   { color: '#22d3ee', lineStyle: 'solid', arrow: false, category: '合作', label: '集成' },
  // evaluation
  praises:    { color: '#34d399', lineStyle: 'solid', arrow: true, category: '评价', label: '赞扬' },
  criticizes: { color: '#fb923c', lineStyle: 'solid', arrow: true, category: '评价', label: '批评' },
  mentors:    { color: '#34d399', lineStyle: 'solid', arrow: true, category: '评价', label: '指导' },
  related:    { color: '#94a3b8', lineStyle: 'dashed', arrow: false, category: '其他', label: '相关' },
};

// ── Relation category colors (for legend) ──
export const RELATION_CATEGORIES = [
  { key: '结构', color: '#60a5fa', label: '结构（开发/参与/就职）' },
  { key: '创始', color: '#f59e0b', label: '创始' },
  { key: '投资', color: '#a78bfa', label: '投资/收购' },
  { key: '竞争', color: '#ef4444', label: '竞争/对比' },
  { key: '合作', color: '#22d3ee', label: '合作/集成' },
  { key: '评价', color: '#34d399', label: '评价（赞扬/批评）' },
  { key: '其他', color: '#94a3b8', label: '其他（相关）' },
];

// ── Z-index hierarchy ──
// Layers from bottom to top:
//   GRAPH_CONTROLS (20) — filter/search panels on graph page
//   GRAPH_LEGEND   (20) — type legend overlay on graph page
//   GRAPH_TOOLTIP  (30) — hover tooltip on graph nodes
//   ENTITY_DRAWER  (40) — slide-out entity detail panel
//   NAVBAR         (50) — top navigation bar (always on top)
export const Z_INDEX = {
  GRAPH_CONTROLS: 20,
  GRAPH_LEGEND: 20,
  GRAPH_TOOLTIP: 30,
  ENTITY_DRAWER: 40,
  NAVBAR: 50,
} as const;

// ── Leaderboard segment config ──
export const LEADERBOARD_SEGMENTS = [
  { key: 'products' as const, label: '产品' },
  { key: 'founders' as const, label: '创始人' },
  { key: 'vcs' as const, label: '投资机构' },
  { key: 'companies' as const, label: '公司' },
];

// ── Sponsor data (hardcoded) ──
export const SPONSOR_RECORDS: SponsorRecord[] = [
  {
    id: 'justin-hds',
    name: 'Justin&韩德胜',
    amount: 400,
    sortOrder: 1,
    lockedTitle: '葬爱Web4唯一指定金主',
    trailingLabel: '老资历',
    trailingLabelVariant: 'badge',
    legacyVariant: 'primary',
  },
  {
    id: 'doge',
    name: 'Doge',
    amount: 200,
    sortOrder: 2,
    lockedTitle: '葬爱Web4唯二指定金主',
    trailingLabel: '老资历',
    trailingLabelVariant: 'badge',
    legacyVariant: 'secondary',
  },
  {
    id: 'guancha',
    name: '观猹',
    amount: 1588,
    sortOrder: 3,
    trailingLabel: 'watcha.cn',
    trailingLabelVariant: 'plain',
  },
  {
    id: 'guixingren',
    name: '硅星人',
    amount: 1066,
    sortOrder: 4,
  },
  {
    id: 'yizhiyanhua-community',
    name: '一支烟花社区&阿里千问',
    amount: 888,
    sortOrder: 5,
  },
  {
    id: 'citron',
    name: 'Citron',
    amount: 600,
    sortOrder: 6,
  },
  {
    id: 'erinyu',
    name: 'Erinyu',
    amount: 200,
    sortOrder: 7,
  },
  {
    id: 'huangjie-media',
    name: '黄姐传媒',
    amount: 1038,
    sortOrder: 8,
  },
  {
    id: 'shuichan-market',
    name: '水产市场',
    amount: 100,
    sortOrder: 9,
  },
  {
    id: 'berton-ai',
    name: 'Berton AI',
    amount: 1040,
    sortOrder: 10,
    trailingLabel: '微信sonnenblu',
    trailingLabelVariant: 'plain',
  },
  {
    id: 'stain',
    name: 'stain',
    amount: 800,
    sortOrder: 11,
  },
  {
    id: 'xiaodengqun',
    name: '小登群',
    amount: 0.01,
    sortOrder: 12,
  },
];

export function getSponsorTitle(record: SponsorRecord, rank?: number): string {
  if (record.lockedTitle) {
    return record.lockedTitle;
  }

  if (rank === 1) {
    return '葬爱Web4万古至尊金主';
  }

  if (record.amount >= 1000) {
    return '葬爱Web4至高无上功德主';
  }

  if (record.amount >= 600) {
    return '葬爱Web4无上功德主';
  }

  if (record.amount >= 500) {
    return '葬爱Web4大功德主';
  }

  if (record.amount >= 200) {
    return '葬爱Web4护法金主';
  }

  return '葬爱Web4随喜功德主';
}

function resolveSponsorVisual(
  record: SponsorRecord,
  rank: number
): Pick<SponsorLeaderboardEntry, 'iconVariant' | 'themeVariant' | 'trailingLabel' | 'trailingLabelVariant' | 'isLegacyPatron'> {
  const title = getSponsorTitle(record, rank);
  const trailing = {
    trailingLabel: record.trailingLabel,
    trailingLabelVariant: record.trailingLabelVariant,
  };

  if (record.legacyVariant === 'primary') {
    return {
      iconVariant: 'legacy-primary',
      themeVariant: 'legacy-primary',
      ...trailing,
      isLegacyPatron: true,
    };
  }

  if (record.legacyVariant === 'secondary') {
    return {
      iconVariant: 'legacy-secondary',
      themeVariant: 'legacy-secondary',
      ...trailing,
      isLegacyPatron: true,
    };
  }

  if (rank === 1) {
    return {
      iconVariant: 'supreme-crown',
      themeVariant: 'supreme-gold',
      ...trailing,
      isLegacyPatron: false,
    };
  }

  if (title === '葬爱Web4至高无上功德主') {
    return {
      iconVariant: 'gem',
      themeVariant: 'top-gold',
      ...trailing,
      isLegacyPatron: record.trailingLabelVariant === 'badge',
    };
  }

  if (title === '葬爱Web4无上功德主') {
    return {
      iconVariant: 'triple-crown',
      themeVariant: 'high-gold',
      ...trailing,
      isLegacyPatron: false,
    };
  }

  if (title === '葬爱Web4大功德主') {
    return {
      iconVariant: 'double-crown',
      themeVariant: 'guardian',
      ...trailing,
      isLegacyPatron: false,
    };
  }

  if (title === '葬爱Web4护法金主') {
    return {
      iconVariant: 'single-crown',
      themeVariant: 'guardian',
      ...trailing,
      isLegacyPatron: false,
    };
  }

  return {
    iconVariant: 'single-crown',
    themeVariant: 'supporter',
    ...trailing,
    isLegacyPatron: false,
  };
}

export function buildSponsorLeaderboard(
  records: SponsorRecord[]
): SponsorLeaderboardEntry[] {
  return [...records]
    .sort((a, b) => b.amount - a.amount || a.sortOrder - b.sortOrder)
    .map((record, index) => {
      const rank = index + 1;
      const visual = resolveSponsorVisual(record, rank);

      return {
        id: record.id,
        rank,
        name: record.name,
        title: getSponsorTitle(record, rank),
        karma: `+${record.amount}`,
        amount: record.amount,
        ...visual,
      };
    });
}

export const SPONSORS_DATA = buildSponsorLeaderboard(SPONSOR_RECORDS);
