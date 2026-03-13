'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import cytoscape from 'cytoscape';
import fcose from 'cytoscape-fcose';
import type { Core, NodeSingular, EventObject, StylesheetCSS } from 'cytoscape';
import type { GraphData, GraphNode, RelationType } from '@/lib/types';
import { NODE_COLORS, RELATION_STYLES } from '@/lib/constants';
import { Spinner } from '@/components/ui/8bit/spinner';
import { GraphControls } from './GraphControls';
import { GraphLegend } from './GraphLegend';
import { EntityDrawer } from './EntityDrawer';

// Register fcose layout once
cytoscape.use(fcose);

// ── Helpers ──

function nodeSize(node: GraphNode): number {
  const base = Math.max(20, 10 + Math.log2((node.mention_count || 1) + 1) * 8);
  const boost = node.sizeBoost || 1;
  return base * boost;
}

function edgeWidth(weight: number): number {
  return Math.max(1, Math.min(4, Math.log2((weight || 1) + 1)));
}

function lightenColor(hex: string, amount: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, ((num >> 16) & 0xff) + amount);
  const g = Math.min(255, ((num >> 8) & 0xff) + amount);
  const b = Math.min(255, (num & 0xff) + amount);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

// ── Build cytoscape stylesheet ──

function buildStylesheet(): StylesheetCSS[] {
  return [
    // Default node style
    {
      selector: 'node',
      style: {
        'background-color': (ele: { data: (key: string) => string }) =>
          NODE_COLORS[ele.data('type')] || '#888',
        'border-width': 2,
        'border-color': (ele: { data: (key: string) => string }) =>
          lightenColor(NODE_COLORS[ele.data('type')] || '#888', 40),
        width: (ele: { data: (key: string) => number }) => nodeSize(ele.data('_raw') as unknown as GraphNode),
        height: (ele: { data: (key: string) => number }) => nodeSize(ele.data('_raw') as unknown as GraphNode),
        label: '',
        'text-valign': 'bottom',
        'text-halign': 'center',
        'text-margin-y': 4,
        'font-size': 10,
        color: '#e0daf0',
        'text-outline-width': 2,
        'text-outline-color': '#0f0a1a',
        'text-max-width': '100px',
        'text-wrap': 'ellipsis',
        'min-zoomed-font-size': 0,
        'overlay-opacity': 0,
      },
    },
    // Show-label class: display the label
    {
      selector: 'node.show-label',
      style: {
        label: 'data(label)',
      },
    },
    // Featured node style
    {
      selector: 'node[?featured]',
      style: {
        'border-width': 3,
        'border-color': (ele: { data: (key: string) => string }) =>
          lightenColor(NODE_COLORS[ele.data('type')] || '#888', 60),
      },
    },
    // Selected node
    {
      selector: 'node.highlighted',
      style: {
        'border-width': 4,
        'border-color': '#ffffff',
        label: 'data(label)',
        'z-index': 20,
      },
    },
    // Neighbor of selected
    {
      selector: 'node.neighbor',
      style: {
        label: 'data(label)',
        opacity: 1,
        'z-index': 15,
      },
    },
    // Dimmed
    {
      selector: 'node.dimmed',
      style: {
        opacity: 0.15,
      },
    },
    // Hovered
    {
      selector: 'node.hovered',
      style: {
        label: 'data(label)',
        'border-width': 3,
        'border-color': '#ffffff',
        'z-index': 25,
      },
    },
    // Hidden by filter
    {
      selector: 'node.filtered-out',
      style: {
        display: 'none',
      },
    },

    // ── Edges ──
    {
      selector: 'edge',
      style: {
        width: (ele: { data: (key: string) => number }) => edgeWidth(ele.data('weight') as number),
        'line-color': (ele: { data: (key: string) => string }) => {
          const rt = ele.data('relation_type') as RelationType;
          return RELATION_STYLES[rt]?.color || '#555';
        },
        'line-style': (ele: { data: (key: string) => string }) => {
          const rt = ele.data('relation_type') as RelationType;
          return RELATION_STYLES[rt]?.lineStyle || 'solid';
        },
        'target-arrow-color': (ele: { data: (key: string) => string }) => {
          const rt = ele.data('relation_type') as RelationType;
          return RELATION_STYLES[rt]?.color || '#555';
        },
        'target-arrow-shape': (ele: { data: (key: string) => string }) => {
          const rt = ele.data('relation_type') as RelationType;
          return RELATION_STYLES[rt]?.arrow ? 'triangle' : 'none';
        },
        'curve-style': 'bezier',
        opacity: 0.6,
        'overlay-opacity': 0,
      },
    },
    {
      selector: 'edge.highlighted',
      style: {
        opacity: 1,
        'z-index': 10,
      },
    },
    {
      selector: 'edge.dimmed',
      style: {
        opacity: 0.08,
      },
    },
  ] as unknown as StylesheetCSS[];
}

// ── Convert raw data to cytoscape elements ──

function buildElements(data: GraphData) {
  const nodes = data.nodes.map((n) => ({
    data: {
      id: n.id,
      label: n.displayName || n.name,
      type: n.type,
      mention_count: n.mention_count,
      article_count: n.article_count,
      degree: n.degree,
      featured: n.featured || false,
      sizeBoost: n.sizeBoost || 1,
      description: n.description,
      tags: n.tags,
      aliases: n.aliases,
      _raw: n,
    },
  }));

  const edges = data.links.map((l) => ({
    data: {
      id: `${l.source}-${l.target}-${l.relation_type}`,
      source: l.source,
      target: l.target,
      relation_type: l.relation_type,
      label: l.label,
      weight: l.weight,
      effective_weight: l.effective_weight,
      article_count: l.article_count,
    },
  }));

  return [...nodes, ...edges];
}

// ── Main Component ──

export default function GraphCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<Core | null>(null);
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [layoutRunning, setLayoutRunning] = useState(false);
  const [graphData, setGraphData] = useState<GraphData | null>(null);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [typeFilters, setTypeFilters] = useState<Record<string, boolean>>({
    company: true,
    product: true,
    person: true,
  });

  // ── Tooltip state ──
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    name: string;
    type: string;
    description: string;
  } | null>(null);

  // ── Update label visibility based on zoom ──
  const updateLabelVisibility = useCallback((cy: Core) => {
    const zoom = cy.zoom();
    cy.nodes().forEach((node) => {
      // Always show labels for highlighted / hovered / neighbor
      if (
        node.hasClass('highlighted') ||
        node.hasClass('hovered') ||
        node.hasClass('neighbor')
      ) {
        node.addClass('show-label');
        return;
      }

      const degree = node.data('degree') as number;
      const mentionCount = node.data('mention_count') as number;

      if (zoom < 0.4) {
        if (degree > 10) {
          node.addClass('show-label');
        } else {
          node.removeClass('show-label');
        }
      } else if (zoom < 0.8) {
        if (mentionCount > 5) {
          node.addClass('show-label');
        } else {
          node.removeClass('show-label');
        }
      } else {
        node.addClass('show-label');
      }
    });
  }, []);

  // ── Apply type filters ──
  const applyTypeFilters = useCallback((cy: Core, filters: Record<string, boolean>) => {
    cy.nodes().forEach((node) => {
      const type = node.data('type') as string;
      if (filters[type] === false) {
        node.addClass('filtered-out');
      } else {
        node.removeClass('filtered-out');
      }
    });
    // Also hide edges whose source or target is hidden
    cy.edges().forEach((edge) => {
      const srcType = edge.source().data('type') as string;
      const tgtType = edge.target().data('type') as string;
      if (filters[srcType] === false || filters[tgtType] === false) {
        edge.style('display', 'none');
      } else {
        edge.style('display', 'element');
      }
    });
  }, []);

  // ── Highlight a node and its neighborhood ──
  const highlightNode = useCallback((cy: Core, nodeId: string) => {
    // Clear previous
    cy.elements().removeClass('highlighted neighbor dimmed');

    const node = cy.$id(nodeId);
    if (node.length === 0) return;

    const neighborhood = node.neighborhood();
    const connectedEdges = node.connectedEdges();

    // Dim everything
    cy.elements().addClass('dimmed');

    // Un-dim the node, neighbors, and connected edges
    node.removeClass('dimmed').addClass('highlighted');
    neighborhood.nodes().removeClass('dimmed').addClass('neighbor');
    connectedEdges.removeClass('dimmed').addClass('highlighted');

    // Set selected node data for drawer
    setSelectedNode(node.data('_raw') as unknown as GraphNode);
  }, []);

  // ── Clear highlighting ──
  const clearHighlight = useCallback((cy: Core) => {
    cy.elements().removeClass('highlighted neighbor dimmed hovered');
    setSelectedNode(null);
    updateLabelVisibility(cy);
  }, [updateLabelVisibility]);

  // ── Handle node selection (from search or click) ──
  const handleSelectNode = useCallback((nodeId: string) => {
    const cy = cyRef.current;
    if (!cy) return;

    const node = cy.$id(nodeId);
    if (node.length === 0) return;

    highlightNode(cy, nodeId);

    // Animate to fit node + neighbors
    const neighborhood = node.neighborhood().add(node);
    cy.animate({
      fit: { eles: neighborhood, padding: 80 },
      duration: 600,
      easing: 'ease-in-out-cubic',
    });
  }, [highlightNode]);

  // ── Toggle type filter ──
  const handleToggleType = useCallback((type: string) => {
    setTypeFilters((prev) => {
      const next = { ...prev, [type]: !prev[type] };
      const cy = cyRef.current;
      if (cy) {
        applyTypeFilters(cy, next);
      }
      return next;
    });
  }, [applyTypeFilters]);

  // ── Fetch data ──
  useEffect(() => {
    let cancelled = false;

    fetch('/data/graph-view.json')
      .then((res) => res.json())
      .then((data: GraphData) => {
        if (!cancelled) {
          setGraphData(data);
        }
      })
      .catch((err) => {
        console.error('Failed to load graph data:', err);
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // ── Initialize Cytoscape when data + container ready ──
  useEffect(() => {
    if (!graphData || !containerRef.current) return;

    const elements = buildElements(graphData);

    const cy = cytoscape({
      container: containerRef.current,
      elements,
      style: buildStylesheet(),
      minZoom: 0.05,
      maxZoom: 4,
      wheelSensitivity: 0.3,
      pixelRatio: 'auto',
    });

    cyRef.current = cy;

    // Run layout
    setLayoutRunning(true);

    const layout = cy.layout({
      name: 'fcose',
      quality: 'default',
      randomize: true,
      animate: true,
      animationDuration: 1000,
      nodeSeparation: 100,
      idealEdgeLength: (edge: { data: (key: string) => number }) =>
        120 + (1 / ((edge.data('weight') as number) || 1)) * 50,
      nodeRepulsion: () => 8000,
      gravity: 0.25,
      gravityRange: 3.8,
    } as unknown as cytoscape.LayoutOptions);

    layout.on('layoutstop', () => {
      setLayoutRunning(false);
      setLoading(false);

      // Apply initial label visibility
      updateLabelVisibility(cy);

      // Check for ?focus= param
      const focusId = searchParams.get('focus');
      if (focusId) {
        // Small delay to ensure layout is settled
        setTimeout(() => handleSelectNode(focusId), 300);
      }
    });

    layout.run();

    // ── Events ──

    // Zoom: update label visibility
    cy.on('zoom', () => {
      updateLabelVisibility(cy);
    });

    // Click node
    cy.on('tap', 'node', (e: EventObject) => {
      const node = e.target as NodeSingular;
      highlightNode(cy, node.id());
    });

    // Click background
    cy.on('tap', (e: EventObject) => {
      if (e.target === cy) {
        clearHighlight(cy);
      }
    });

    // Double-click node: fit to neighborhood
    cy.on('dbltap', 'node', (e: EventObject) => {
      const node = e.target as NodeSingular;
      const neighborhood = node.neighborhood().add(node);
      cy.animate({
        fit: { eles: neighborhood, padding: 60 },
        duration: 500,
        easing: 'ease-in-out-cubic',
      });
    });

    // Hover node: show tooltip
    cy.on('mouseover', 'node', (e: EventObject) => {
      const node = e.target as NodeSingular;
      node.addClass('hovered');
      const pos = node.renderedPosition();
      setTooltip({
        x: pos.x,
        y: pos.y,
        name: node.data('label') as string,
        type: node.data('type') as string,
        description: node.data('description') as string,
      });
    });

    cy.on('mouseout', 'node', (e: EventObject) => {
      const node = e.target as NodeSingular;
      node.removeClass('hovered');
      setTooltip(null);
    });

    return () => {
      cy.destroy();
      cyRef.current = null;
    };
    // Only run on data change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [graphData]);

  // ── Drawer close ──
  const handleCloseDrawer = useCallback(() => {
    const cy = cyRef.current;
    if (cy) clearHighlight(cy);
  }, [clearHighlight]);

  // ── Navigate to node from drawer ──
  const handleNavigateToNode = useCallback((nodeId: string) => {
    handleSelectNode(nodeId);
  }, [handleSelectNode]);

  return (
    <div className="relative w-full h-[calc(100vh-3.5rem)]">
      {/* Cytoscape container */}
      <div
        ref={containerRef}
        className="absolute inset-0"
        style={{ width: '100%', height: '100%' }}
      />

      {/* Loading overlay */}
      {(loading || layoutRunning) && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
          <Spinner className="size-8 text-primary" />
          <p className="retro mt-4 text-xs text-muted-foreground">
            {loading ? '加载图谱数据...' : '计算布局...'}
          </p>
        </div>
      )}

      {/* Controls */}
      <GraphControls
        cy={cyRef.current}
        onSelectNode={handleSelectNode}
        typeFilters={typeFilters}
        onToggleType={handleToggleType}
      />

      {/* Legend */}
      <GraphLegend />

      {/* Tooltip */}
      {tooltip && (
        <div
          className="pointer-events-none absolute z-30 max-w-[200px] rounded border border-border bg-background/90 px-2 py-1.5 text-xs shadow-lg backdrop-blur-sm"
          style={{
            left: tooltip.x + 15,
            top: tooltip.y - 10,
          }}
        >
          <p className="font-medium text-foreground">{tooltip.name}</p>
          <p className="text-[10px] text-muted-foreground capitalize">{tooltip.type}</p>
          {tooltip.description && (
            <p className="mt-1 text-[10px] text-muted-foreground line-clamp-2">
              {tooltip.description}
            </p>
          )}
        </div>
      )}

      {/* Entity Drawer */}
      {selectedNode && graphData && (
        <EntityDrawer
          node={selectedNode}
          links={graphData.links}
          cy={cyRef.current}
          onClose={handleCloseDrawer}
          onNavigateToNode={handleNavigateToNode}
        />
      )}
    </div>
  );
}
