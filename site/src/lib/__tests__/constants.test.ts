import { describe, it, expect } from 'vitest';
import {
  NODE_TYPE_REGISTRY,
  NODE_COLORS,
  NODE_TYPE_LABELS,
  NODE_BADGE_CLASSES,
  ALL_NODE_TYPES,
  RELATION_STYLES,
  SPONSORS_DATA,
  SPONSOR_RECORDS,
  buildSponsorLeaderboard,
  getSponsorTitle,
} from '../constants';
import type { NodeType, RelationType } from '../types';

describe('NODE_TYPE_REGISTRY', () => {
  const expectedTypes: NodeType[] = ['company', 'person', 'product', 'vc_firm'];

  it('contains all expected node types', () => {
    for (const type of expectedTypes) {
      expect(NODE_TYPE_REGISTRY[type]).toBeDefined();
    }
  });

  it('each entry has color, label, and badgeClass', () => {
    for (const entry of Object.values(NODE_TYPE_REGISTRY)) {
      expect(entry.color).toMatch(/^#[0-9a-f]{6}$/i);
      expect(entry.label).toBeTruthy();
      expect(entry.badgeClass).toBeTruthy();
    }
  });
});

describe('derived constants', () => {
  it('NODE_COLORS has same keys as registry', () => {
    expect(Object.keys(NODE_COLORS).sort()).toEqual(Object.keys(NODE_TYPE_REGISTRY).sort());
  });

  it('NODE_TYPE_LABELS has same keys as registry', () => {
    expect(Object.keys(NODE_TYPE_LABELS).sort()).toEqual(Object.keys(NODE_TYPE_REGISTRY).sort());
  });

  it('NODE_BADGE_CLASSES has same keys as registry', () => {
    expect(Object.keys(NODE_BADGE_CLASSES).sort()).toEqual(Object.keys(NODE_TYPE_REGISTRY).sort());
  });

  it('ALL_NODE_TYPES matches registry keys', () => {
    expect([...ALL_NODE_TYPES].sort()).toEqual(Object.keys(NODE_TYPE_REGISTRY).sort());
  });
});

describe('RELATION_STYLES', () => {
  const expectedRelations: RelationType[] = [
    'acquires', 'co_founded', 'collaborates_with', 'compares_to',
    'competes_with', 'criticizes', 'develops', 'founder_of',
    'integrates_with', 'invests_in', 'mentors', 'partners_with',
    'related',
    'praises', 'works_at', 'works_on',
  ];

  it('contains all relation types', () => {
    expect(Object.keys(RELATION_STYLES).sort()).toEqual(expectedRelations.sort());
  });

  it('each entry has required fields', () => {
    for (const style of Object.values(RELATION_STYLES)) {
      expect(style.color).toMatch(/^#[0-9a-f]{6}$/i);
      expect(['solid', 'dashed']).toContain(style.lineStyle);
      expect(typeof style.arrow).toBe('boolean');
      expect(style.category).toBeTruthy();
      expect(style.label).toBeTruthy();
    }
  });
});

describe('SPONSORS_DATA', () => {
  it('sorts by absolute amount while keeping legacy titles and trailing labels', () => {
    expect(SPONSORS_DATA.map(({ rank, name, title, karma, iconVariant, themeVariant, trailingLabel, trailingLabelVariant }) => ({
      rank,
      name,
      title,
      karma,
      iconVariant,
      themeVariant,
      trailingLabel,
      trailingLabelVariant,
    }))).toEqual([
      {
        rank: 1,
        name: '观猹',
        title: '葬爱Web4万古至尊金主',
        karma: '+1588',
        iconVariant: 'supreme-crown',
        themeVariant: 'supreme-gold',
        trailingLabel: 'watcha.cn',
        trailingLabelVariant: 'plain',
      },
      {
        rank: 2,
        name: '硅星人',
        title: '葬爱Web4至高无上功德主',
        karma: '+1066',
        iconVariant: 'gem',
        themeVariant: 'top-gold',
        trailingLabel: undefined,
        trailingLabelVariant: undefined,
      },
      {
        rank: 3,
        name: 'Berton AI',
        title: '葬爱Web4至高无上功德主',
        karma: '+1040',
        iconVariant: 'gem',
        themeVariant: 'top-gold',
        trailingLabel: '微信sonnenblu',
        trailingLabelVariant: 'plain',
      },
      {
        rank: 4,
        name: '黄姐传媒',
        title: '葬爱Web4至高无上功德主',
        karma: '+1038',
        iconVariant: 'gem',
        themeVariant: 'top-gold',
        trailingLabel: undefined,
        trailingLabelVariant: undefined,
      },
      {
        rank: 5,
        name: '一支烟花社区&阿里千问',
        title: '葬爱Web4无上功德主',
        karma: '+888',
        iconVariant: 'triple-crown',
        themeVariant: 'high-gold',
        trailingLabel: undefined,
        trailingLabelVariant: undefined,
      },
      {
        rank: 6,
        name: 'stain',
        title: '葬爱Web4无上功德主',
        karma: '+800',
        iconVariant: 'triple-crown',
        themeVariant: 'high-gold',
        trailingLabel: undefined,
        trailingLabelVariant: undefined,
      },
      {
        rank: 7,
        name: 'Citron',
        title: '葬爱Web4无上功德主',
        karma: '+600',
        iconVariant: 'triple-crown',
        themeVariant: 'high-gold',
        trailingLabel: undefined,
        trailingLabelVariant: undefined,
      },
      {
        rank: 8,
        name: 'Justin&韩德胜',
        title: '葬爱Web4唯一指定金主',
        karma: '+400',
        iconVariant: 'legacy-primary',
        themeVariant: 'legacy-primary',
        trailingLabel: '老资历',
        trailingLabelVariant: 'badge',
      },
      {
        rank: 9,
        name: 'Doge',
        title: '葬爱Web4唯二指定金主',
        karma: '+200',
        iconVariant: 'legacy-secondary',
        themeVariant: 'legacy-secondary',
        trailingLabel: '老资历',
        trailingLabelVariant: 'badge',
      },
      {
        rank: 10,
        name: 'Erinyu',
        title: '葬爱Web4护法金主',
        karma: '+200',
        iconVariant: 'single-crown',
        themeVariant: 'guardian',
        trailingLabel: undefined,
        trailingLabelVariant: undefined,
      },
      {
        rank: 11,
        name: '水产市场',
        title: '葬爱Web4随喜功德主',
        karma: '+100',
        iconVariant: 'single-crown',
        themeVariant: 'supporter',
        trailingLabel: undefined,
        trailingLabelVariant: undefined,
      },
      {
        rank: 12,
        name: '小登群',
        title: '葬爱Web4随喜功德主',
        karma: '+0.01',
        iconVariant: 'single-crown',
        themeVariant: 'supporter',
        trailingLabel: undefined,
        trailingLabelVariant: undefined,
      },
    ]);
  });

  it('sorts same-amount supporters by stable support order', () => {
    const derived = buildSponsorLeaderboard(SPONSOR_RECORDS);
    expect(derived.filter(({ amount }) => amount === 200).map(({ name }) => name)).toEqual([
      'Doge',
      'Erinyu',
    ]);
  });

  it('assigns rank-aware sponsor titles and keeps legacy labels', () => {
    expect(getSponsorTitle({
      id: 'top',
      name: 'Top',
      amount: 1588,
      sortOrder: 1,
    }, 1)).toBe('葬爱Web4万古至尊金主');

    expect(getSponsorTitle({
      id: 'high',
      name: 'High',
      amount: 1040,
      sortOrder: 2,
    }, 2)).toBe('葬爱Web4至高无上功德主');

    expect(getSponsorTitle({
      id: 'upper',
      name: 'Upper',
      amount: 800,
      sortOrder: 3,
    })).toBe('葬爱Web4无上功德主');

    expect(getSponsorTitle({
      id: 'mid',
      name: 'Mid',
      amount: 520,
      sortOrder: 4,
    })).toBe('葬爱Web4大功德主');

    expect(getSponsorTitle({
      id: 'guard',
      name: 'Guard',
      amount: 200,
      sortOrder: 5,
    })).toBe('葬爱Web4护法金主');

    expect(getSponsorTitle({
      id: 'support',
      name: 'Support',
      amount: 100,
      sortOrder: 6,
    })).toBe('葬爱Web4随喜功德主');

    expect(getSponsorTitle({
      id: 'micro',
      name: 'Micro',
      amount: 0.01,
      sortOrder: 7,
    })).toBe('葬爱Web4随喜功德主');

    expect(getSponsorTitle({
      id: 'legacy',
      name: 'Legacy',
      amount: 400,
      sortOrder: 8,
      lockedTitle: '葬爱Web4唯一指定金主',
    })).toBe('葬爱Web4唯一指定金主');
  });
});
