import Link from 'next/link';
import { CenteredScreen } from '@/components/layout/StatusScreen';

export default function LandingPage() {
  return (
    <CenteredScreen>
      {/* Logo */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo.png"
        alt="葬AI"
        className="w-40 md:w-56"
        style={{ imageRendering: 'pixelated' }}
      />

      {/* Site name */}
      <h1 className="mt-6 text-[36px] md:text-[48px] text-primary tracking-wider
                      drop-shadow-[0_0_24px_rgba(115,81,207,0.4)]">
        葬AI Web4
      </h1>

      {/* Subtitle */}
      <p className="mt-3 text-xs text-muted-foreground">
        数据截至第069篇「一个山东套壳AI如何上桌」(2026.03.13)
      </p>

      {/* Entry buttons */}
      <div className="mt-12 flex gap-6">
        <Link
          href="/graph"
          className="px-6 py-3 text-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-colors border-2 border-primary"
        >
          图谱
        </Link>
        <Link
          href="/articles"
          className="px-6 py-3 text-sm text-foreground border-2 border-border hover:border-primary hover:text-primary transition-colors"
        >
          文章
        </Link>
      </div>
    </CenteredScreen>
  );
}
