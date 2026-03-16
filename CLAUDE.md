# 葬AI 知识图谱分析站点

> Last verified: 2026-03-16

## 项目概述

为中文 AI 行业评论媒体"葬AI"搭建公开知识图谱分析站点。70 篇文章（编号 001-070，003 缺）经 Gemini 提取实体与关系，聚合为知识图谱（具体节点/边数量见 `web-data/graph-view.json`）。纯静态部署，无后端。

## 品牌风格

- **品牌色**: `#7351cf`（紫色）
- **辅助色**: 粉色/珊瑚色（来自 logo 物料）
- **风格关键词**: 非主流、大胆、叛逆、像素风元素
- **品牌物料位置**: `葬ai物料/`
- **Logo**: "@葬AI"，有像素风按钮版本
- 暗色主题为主，紫色背景 + 强对比

## 数据文件

| 文件 | 用途 |
|------|------|
| `web-data/graph-view.json` | 主图谱数据（nodes + links） |
| `web-data/article-index.json` | 68 篇文章索引 |
| `web-data/articles/{001-068}.json` | 单篇文章详情（body_markdown、entities、relationships） |
| `web-data/leaderboards.json` | 4 个分类排行榜（products/founders/vcs/companies） |
| `data/config/display_registry.json` | 节点展示配置（visualMode、featured） |
| `data/graph/canonical.json` | 聚合后原始图谱 |
| `data/graph/canonical_corrected.json` | 后处理修正后图谱 |

## 技术架构

```
scripts/                       # 完整提取+后处理管线
├── extract_gemini.py          # Gemini 提取（支持多 key 轮询）
├── graph_builder.py           # 图谱聚合
├── graph_utils.py             # 实体类型/合并/关系配置
├── pipeline_state.py          # 版本管理 + manifest
├── build_graph.py             # 聚合入口
├── run_full_extraction.py     # 全量提取 runner
├── overrides.py               # 声明式后处理规则
├── post_process.py            # 后处理执行引擎
├── build_presentation.py      # 前端数据生成
└── enrich_graph.py            # (legacy) 旧后处理脚本，待移除

site/                          # Next.js 项目根目录
├── public/data/               # prebuild 脚本从 web-data/ 拷贝
├── src/
│   ├── app/
│   │   ├── layout.tsx         # 根布局（html/body + 全局样式）
│   │   ├── page.tsx           # 品牌落地页（/）— 无导航栏
│   │   ├── not-found.tsx      # 品牌 404 页面
│   │   └── (main)/            # Route Group — 有导航的页面
│   │       ├── layout.tsx     # Navbar 布局
│   │       ├── graph/
│   │       │   ├── page.tsx   # 服务端组件
│   │       │   └── GraphClient.tsx  # 客户端：图谱 + 侧栏
│   │       ├── articles/
│   │       │   ├── layout.tsx # 宽度包装 + Footer
│   │       │   ├── page.tsx   # 文章列表
│   │       │   └── [id]/page.tsx  # 文章详情（SSG）
│   │       └── leaderboard/
│   │           └── page.tsx   # 排行榜
│   ├── components/
│   │   ├── layout/            # Navbar, Footer
│   │   ├── graph/             # GraphCanvas, GraphControls, GraphLegend, EntityDrawer
│   │   ├── leaderboard/       # LeaderboardTabs, LeaderboardSidebar
│   │   └── article/           # ArticleList, ArticleBody, EntityTag
│   ├── hooks/
│   │   ├── useGraphData.ts    # 图谱数据加载（fetch + error/retry）
│   │   └── useGraphInteraction.ts  # 图谱交互逻辑（选中/高亮/过滤/tooltip）
│   └── lib/
│       ├── types.ts           # 全部 TS 类型定义
│       ├── data.ts            # 数据加载工具（SSG 用）
│       ├── graph-config.ts    # Cytoscape 样式/布局配置/纯函数
│       └── constants.ts       # NODE_TYPE_REGISTRY、关系类型映射
```

## 路由结构

`(main)/` 是唯一路由组。根级路由已删除（仅保留 `page.tsx` 落地页和 `layout.tsx` 根布局）。

| 路由 | 渲染 | 数据加载 |
|------|------|----------|
| `/` | SSG | 无数据依赖 |
| `/graph` | SSG shell + CSR canvas | graph-view.json 客户端 fetch |
| `/leaderboard` | SSG | leaderboards.json 构建时读取 |
| `/articles` | SSG | article-index.json 构建时读取 |
| `/articles/[id]` | SSG（generateStaticParams） | 各 article JSON 构建时读取 |

## 核心依赖

```
next ^14.2, react ^18.3, typescript ^5.5
cytoscape ^3.30, cytoscape-fcose ^2.2
react-markdown ^9.0, remark-gfm ^4.0
tailwindcss ^3.4
```

## 节点类型系统

节点类型由 `NODE_TYPE_REGISTRY`（`constants.ts`）统一管理。

### 如何新增节点类型

1. `site/src/lib/types.ts` — 在 `NodeType` union 中添加新类型
2. `site/src/lib/constants.ts` — 在 `NODE_TYPE_REGISTRY` 中添加新条目（color, label, badgeClass）

所有其他引用（`NODE_COLORS`、`NODE_TYPE_LABELS`、`NODE_BADGE_CLASSES`、`ALL_NODE_TYPES`、GraphLegend、GraphControls 筛选、LeaderboardTabs/Sidebar badge）均从 registry 自动派生。

### 如何新增关系类型

1. `site/src/lib/types.ts` — 在 `RelationType` union 中添加新类型
2. `site/src/lib/constants.ts` — 在 `RELATION_STYLES` 中添加新条目

## 图谱实现要点

### Cytoscape 配置（`graph-config.ts`）
- **布局**: `fcose`（快速力导向），参数见 `FCOSE_LAYOUT_OPTIONS`
- **节点大小**: `nodeSize()` — 基于 `composite_weight` 线性映射到 [20, 80]
- **缩放标签**: `ZOOM_THRESHOLDS` 控制不同缩放级别的标签显示策略
- **动态导入**: `dynamic(() => import('./GraphCanvas'), { ssr: false })`

### 交互（`useGraphInteraction.ts`）
1. 点击节点 → EntityDrawer + 高亮邻居
2. 搜索 → 匹配 name + aliases，聚焦节点
3. 类型筛选 → checkbox 过滤
4. URL 参数 `?focus=nodeId` → 初始化定位

## 15 种关系类型

acquires, co_founded, collaborates_with, compares_to, competes_with, criticizes, develops, founder_of, integrates_with, invests_in, mentors, partners_with, praises, works_at, works_on

## 构建与部署

```js
// next.config.ts
{ output: 'export', images: { unoptimized: true }, trailingSlash: true }
```

- prebuild 脚本: `web-data/` → `site/public/data/`
- `next build` → 纯静态 `out/`
- 部署目标: Vercel / Netlify / Cloudflare Pages

## 前端布局契约

前端维护规则统一写在 `docs/frontend-layout-contracts.md`。做 UI/布局相关改动时，先看这个文档。

速记规则：

- 不要为了前端维护去改 `scripts/`、`data/`、`web-data/`、`pipeline.toml`
- 页面壳管 `max-width`、gutter、grid、sticky/fixed、跨区块对齐
- feature 组件只管本功能内部布局
- primitive 如需影响布局，必须暴露显式 prop/variant
- `--navbar-height` 是导航高度唯一来源
- 排行榜对齐规则以该文档为准，不要再用嵌套 `justify-center` 拼凑

## 提取管线

### 全链路命令
```bash
python3 scripts/run_full_extraction.py --force   # 提取 + 聚合 → canonical.json
python3 scripts/post_process.py                  # 后处理 → canonical_corrected.json
python3 scripts/build_presentation.py            # 生成前端数据 → web-data/
cd site && npm run build                         # 构建前端
```

### 多 key 支持
在 `.env` 中设置 `GEMINI_API_KEY=key1,key2,key3`（逗号分隔），自动轮询。

### 后处理规则
所有领域知识集中在 `scripts/overrides.py`（纯数据文件）：
- MISSING_NODES: 补充 Gemini 未提取的节点（step0b）
- NODE_MERGES: 同义节点合并
- TYPE_CORRECTIONS: 实体类型修正
- DESCRIPTION_OVERRIDES: 节点描述中性化改写（step3b）
- EDGE_TYPE_FIXES: 关系类型/端点修正
- MISSING_EDGES: 补充 Gemini 无法推导的关系
- BIDIRECTIONAL_RELATION_TYPES: 对称关系双向补全
- COMPANY_SUBSIDIARIES: 公司排行榜子公司合并规则（仅排行榜，不影响图谱）
- EXCLUDED_ARTICLES: 排除的文章ID集合（聚合和文章索引均跳过）

### 排序公式（composite_weight）

**公式**（三个独立维度，各自归一化后加权求和）：

`cw = 0.40 * (degree/max_d) + 0.40 * (effective_mc/max_mc) + 0.20 * (article_count/max_a)`

- **degree（连接数）权重 40%**：体现在知识图谱中的网络枢纽性
- **effective_mc（提及数）权重 40%**：体现被深度讨论的程度
- **article_count（文章覆盖）权重 20%**：体现跨文章的广泛性

**标题提及奖励**：文章标题中出现的实体，每篇文章额外 +5 mention_count（在 `graph_builder.py` 聚合阶段添加）。不修改 extracted 数据，仅影响聚合后的 mention_count。

其中 `effective_mc = min(mention_count, 25 * article_count)`，每篇文章最多计 25 次有效提及，抑制单篇专访高频提及但跨文章覆盖率低的实体。

**两种归一化场景**：

- **图谱节点大小**：使用全局 composite_weight（`post_process.py` step7），所有节点共用同一组 max 值。这决定图谱中节点的视觉大小。
- **排行榜排名**：使用分类内 composite_weight（`build_presentation.py`），每个排行榜独立计算 max 值归一化。产品榜用产品的最大值，创始人榜用创始人的最大值，互不干扰。

**公司排行榜子公司合并**（仅排行榜，不影响图谱可视化）：
- 合并前汇总子公司的 degree（求和）、mention_count（求和）、article_count（文章集合取并集去重）
- 子公司从公司排行榜中移除，其数据并入母公司
- 合并规则见 `overrides.py` 的 `COMPANY_SUBSIDIARIES`

**排行榜排除规则**：见 `overrides.py` 的 `LEADERBOARD_EXCLUDE`（如葬AI作者从创始人榜排除）

## 变更规范

每次改动必须：
1. 在 `CHANGELOG.md` 的 `[Unreleased]` 下添加条目
2. 如涉及架构变更（新文件/目录、路由变更、数据流变更），同步更新 `CLAUDE.md`
3. 如涉及前端布局/组件边界变更，同步检查 `docs/frontend-layout-contracts.md` 是否需要更新
4. 新增节点类型 → 只改 `constants.ts` 的 `NODE_TYPE_REGISTRY` + `types.ts` 的 `NodeType`
5. 新增关系类型 → 只改 `constants.ts` 的 `RELATION_STYLES` + `types.ts` 的 `RelationType`
6. 新增后处理规则 → 只改 `overrides.py`
7. 新增实体类型 → 同时改 `graph_utils.py` 的 `ALLOWED_ENTITY_TYPES` + `TYPE_ALIASES`
