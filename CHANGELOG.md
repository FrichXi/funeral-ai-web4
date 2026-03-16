# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added
- Frontend maintainability contracts in `docs/frontend-layout-contracts.md`, plus shared layout shells (`PageContainer`, `CenteredScreen`, `StatusScreen`) and a small layout regression test for the 8bit table contract.
- SEO and site metadata support: route metadata, article metadata generation, sitemap, favicon, JSON-LD, and crawler-facing files (`robots.txt`, `llms.txt`).
- Frontend error handling and refactors: branded root/route error screens, graph config/hooks extraction, route-group cleanup, and responsive/mobile graph controls.
- Pipeline and data tooling: `run_pipeline.py`, `post_process.py`, `build_presentation.py`, `pipeline.toml`, Vitest/pytest/CI, and multi-key Gemini support.
- Knowledge graph/data-model upgrades: `vc_firm` type, declarative override buckets, article exclusions, sponsor data, article-index enrichment, and new/renumbered article coverage.

### Changed
- Hidden frontend layout rules are now explicit: navbar height uses `--navbar-height`, graph viewport and entity drawer offsets derive from that variable, and 8bit table layout uses explicit `layout`/`align` props.
- Leaderboard UI evolved from a simple title/list into the current tabbed table + sponsor table layout, with alignment and sizing fixes across desktop and mobile breakpoints.
- Graph and article UX refinements: sidebar sizing, entity drawer mobile behavior, touch targets, font sizing, homepage subtitle, and standard content-page shell reuse.
- Knowledge graph build behavior changed substantially: ranking formula was revised more than once, article index shape was normalized for the frontend, and display/ranking data now come from the presentation build step.

### Fixed
- Article entity references are remapped to canonical graph node IDs during presentation build, fixing broken entity tags and relationship references in article JSON.
- Large batches of graph data issues were corrected: duplicate nodes merged, entity types normalized, missing or wrong edges repaired, bidirectional competitive links filled, and several high-mention outliers suppressed in rankings.
- Frontend bugs fixed across tabs, mobile drawers, article pages, metadata text, and leaderboard presentation.

### Removed
- Article 011 from aggregation and frontend outputs via `EXCLUDED_ARTICLES`.
- Unused/obsolete UI files, duplicate route files, audit artifacts, and duplicate generated data copies.

## [0.2.0] - 2026-03-13

### Added
- (main) route group + Navbar + Footer
- 品牌落地页 (/)
- 图谱页集成排行榜侧栏

### 架构备注
- 路由结构: / (落地页) + (main)/ 下 graph/articles/leaderboard
- 数据流: web-data/ → prebuild.sh → public/data/ → SSG/CSR
