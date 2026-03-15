import { Footer } from '@/components/layout/Footer';

export default function ArticlesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="mx-auto max-w-7xl px-4 py-6">{children}</div>
      <Footer />
    </>
  );
}
