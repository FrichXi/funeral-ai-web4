# 葬AI 知识图谱分析站点

> Last verified: 2026-03-14

## 项目概述

为中文 AI 行业评论媒体"葬AI"搭建公开知识图谱分析站点。68 篇文章经 Gemini 提取实体与关系，聚合为知识图谱（具体节点/边数量见 `web-data/graph-view.json`）。纯静态部署，无后端。

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

## 技术架构

```
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

## 变更规范

每次改动必须：
1. 在 `CHANGELOG.md` 的 `[Unreleased]` 下添加条目
2. 如涉及架构变更（新文件/目录、路由变更、数据流变更），同步更新 `CLAUDE.md`
3. 新增节点类型 → 只改 `constants.ts` 的 `NODE_TYPE_REGISTRY` + `types.ts` 的 `NodeType`
4. 新增关系类型 → 只改 `constants.ts` 的 `RELATION_STYLES` + `types.ts` 的 `RelationType`
