import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background px-4">
      <h1 className="text-[64px] text-primary drop-shadow-[0_0_24px_rgba(115,81,207,0.4)]">
        404
      </h1>
      <p className="mt-4 text-sm text-muted-foreground">
        页面不存在
      </p>
      <div className="mt-8 flex gap-4">
        <Link
          href="/"
          className="px-4 py-2 text-xs bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          返回首页
        </Link>
        <Link
          href="/graph"
          className="px-4 py-2 text-xs text-foreground border border-border hover:border-primary hover:text-primary transition-colors"
        >
          探索图谱
        </Link>
      </div>
    </div>
  );
}
