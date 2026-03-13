import Link from 'next/link';
import { getSiteStats, getArticleIndex } from '@/lib/data';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/8bit/card';
import { Button } from '@/components/ui/8bit/button';
import { Separator } from '@/components/ui/8bit/separator';
import { Badge } from '@/components/ui/8bit/badge';

export default function HomePage() {
  const stats = getSiteStats();
  const index = getArticleIndex();

  const recentArticles = [...index.articles]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-12 pb-8">
      {/* ── Hero Section ── */}
      <section className="flex flex-col items-center text-center pt-12 pb-4 space-y-6">
        <h1 className="retro text-4xl md:text-5xl text-primary drop-shadow-[0_0_24px_rgba(115,81,207,0.4)]">
          @葬AI
        </h1>
        <h2 className="retro text-base md:text-lg text-accent">
          AI 行业知识图谱
        </h2>
        <p className="text-sm md:text-base text-muted-foreground max-w-xl leading-relaxed">
          {stats.articleCount} 篇文章 &middot; {stats.nodeCount} 个实体 &middot; {stats.linkCount} 条关系
        </p>
        <Link href="/graph">
          <Button size="lg" className="text-xs mt-2">
            探索知识图谱 &rarr;
          </Button>
        </Link>
      </section>

      <Separator />

      {/* ── Stats Grid ── */}
      <section className="space-y-6">
        <h3 className="retro text-sm text-center text-foreground">
          数据概览
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="shadow-[0_0_12px_rgba(115,81,207,0.15)]">
            <CardHeader>
              <CardDescription className="text-xs">文章数</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">{stats.articleCount}</p>
            </CardContent>
            <CardFooter>
              <span className="text-xs text-muted-foreground">篇深度分析</span>
            </CardFooter>
          </Card>

          <Card className="shadow-[0_0_12px_rgba(115,81,207,0.15)]">
            <CardHeader>
              <CardDescription className="text-xs">实体总数</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">{stats.nodeCount}</p>
            </CardContent>
            <CardFooter>
              <span className="text-xs text-muted-foreground">个知识节点</span>
            </CardFooter>
          </Card>

          <Card className="shadow-[0_0_12px_rgba(115,81,207,0.15)]">
            <CardHeader>
              <CardDescription className="text-xs">关系数</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">{stats.linkCount}</p>
            </CardContent>
            <CardFooter>
              <span className="text-xs text-muted-foreground">条实体关联</span>
            </CardFooter>
          </Card>

          <Card className="shadow-[0_0_12px_rgba(115,81,207,0.15)]">
            <CardHeader>
              <CardDescription className="text-xs">实体构成</CardDescription>
            </CardHeader>
            <CardContent className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">公司</span>
                <span className="text-sm font-bold text-primary">{stats.companyCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">产品</span>
                <span className="text-sm font-bold text-primary">{stats.productCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">人物</span>
                <span className="text-sm font-bold text-primary">{stats.personCount}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator />

      {/* ── Navigation Cards ── */}
      <section className="space-y-6">
        <h3 className="retro text-sm text-center text-foreground">
          开始探索
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/graph" className="group">
            <Card className="h-full shadow-[0_0_12px_rgba(115,81,207,0.15)] transition-shadow hover:shadow-[0_0_24px_rgba(115,81,207,0.3)]">
              <CardHeader>
                <CardTitle className="text-sm text-primary">
                  知识图谱
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground leading-relaxed" style={{ fontFamily: 'inherit' }}>
                  探索 AI 行业实体与关系的交互式图谱
                </p>
              </CardContent>
              <CardFooter>
                <span className="text-xs text-accent group-hover:translate-x-1 transition-transform inline-block">
                  前往 &rarr;
                </span>
              </CardFooter>
            </Card>
          </Link>

          <Link href="/leaderboard" className="group">
            <Card className="h-full shadow-[0_0_12px_rgba(115,81,207,0.15)] transition-shadow hover:shadow-[0_0_24px_rgba(115,81,207,0.3)]">
              <CardHeader>
                <CardTitle className="text-sm text-primary">
                  排行榜
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground leading-relaxed" style={{ fontFamily: 'inherit' }}>
                  查看最受关注的产品、公司和人物
                </p>
              </CardContent>
              <CardFooter>
                <span className="text-xs text-accent group-hover:translate-x-1 transition-transform inline-block">
                  前往 &rarr;
                </span>
              </CardFooter>
            </Card>
          </Link>

          <Link href="/articles" className="group">
            <Card className="h-full shadow-[0_0_12px_rgba(115,81,207,0.15)] transition-shadow hover:shadow-[0_0_24px_rgba(115,81,207,0.3)]">
              <CardHeader>
                <CardTitle className="text-sm text-primary">
                  文章
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground leading-relaxed" style={{ fontFamily: 'inherit' }}>
                  阅读 {stats.articleCount} 篇深度分析文章
                </p>
              </CardContent>
              <CardFooter>
                <span className="text-xs text-accent group-hover:translate-x-1 transition-transform inline-block">
                  前往 &rarr;
                </span>
              </CardFooter>
            </Card>
          </Link>
        </div>
      </section>

      <Separator />

      {/* ── Recent Articles ── */}
      <section className="space-y-6">
        <h3 className="retro text-sm text-center text-foreground">
          最新文章
        </h3>
        <div className="grid grid-cols-1 gap-4">
          {recentArticles.map((article) => (
            <Link key={article.id} href={`/articles/${article.id}`} className="group">
              <Card
                font="normal"
                className="shadow-[0_0_8px_rgba(115,81,207,0.1)] transition-shadow hover:shadow-[0_0_16px_rgba(115,81,207,0.25)]"
              >
                <CardHeader font="normal">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <CardTitle font="normal" className="text-sm text-foreground group-hover:text-primary transition-colors">
                      {article.title}
                    </CardTitle>
                    <span className="text-xs text-muted-foreground shrink-0">
                      {article.date}
                    </span>
                  </div>
                </CardHeader>
                <CardContent font="normal">
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                    {article.excerpt}
                  </p>
                </CardContent>
                <CardFooter font="normal" className="gap-2">
                  <Badge variant="secondary" className="text-[10px]">
                    {article.entity_count} 实体
                  </Badge>
                  <Badge variant="secondary" className="text-[10px]">
                    {article.relationship_count} 关系
                  </Badge>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
        <div className="flex justify-center">
          <Link href="/articles">
            <Button variant="outline" size="lg" className="text-xs">
              查看全部 &rarr;
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
