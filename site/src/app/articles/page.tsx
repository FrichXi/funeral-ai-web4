import { getArticleIndex } from '@/lib/data';
import { ArticleList } from '@/components/article/ArticleList';

export default function ArticlesPage() {
  const index = getArticleIndex();

  // Sort by date descending
  const sorted = [...index.articles].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <section>
      <div className="mb-8">
        <h1 className="retro text-lg text-primary mb-2">文章</h1>
        <p className="text-sm text-muted-foreground">
          共收录 {index.count} 篇来自「葬AI」的评论文章，涵盖 AI 行业公司、产品与人物分析。
        </p>
      </div>
      <ArticleList articles={sorted} />
    </section>
  );
}
