import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Spinner } from '@/components/ui/8bit/spinner';

const GraphCanvas = dynamic(() => import('@/components/graph/GraphCanvas'), {
  ssr: false,
  loading: () => (
    <div className="flex h-[calc(100vh-3.5rem)] w-full items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Spinner className="size-8 text-primary" />
        <p className="retro text-xs text-muted-foreground">加载知识图谱...</p>
      </div>
    </div>
  ),
});

export default function GraphPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-[calc(100vh-3.5rem)] w-full items-center justify-center">
          <Spinner className="size-8 text-primary" />
        </div>
      }
    >
      <GraphCanvas />
    </Suspense>
  );
}
