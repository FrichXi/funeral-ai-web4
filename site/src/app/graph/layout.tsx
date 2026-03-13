export default function GraphLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Override the default main wrapper — graph needs full viewport
  return (
    <div className="-mx-4 -mt-6" style={{ width: 'calc(100% + 2rem)' }}>
      {children}
    </div>
  );
}
