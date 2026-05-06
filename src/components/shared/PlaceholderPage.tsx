type PlaceholderPageProps = {
  title: string;
  route: string;
};

export function PlaceholderPage({ title, route }: PlaceholderPageProps) {
  return (
    <main className="flex min-h-svh items-center justify-center bg-gradient-to-b from-amberSpark via-lemon to-white px-6 text-charcoal">
      <section className="w-full max-w-[390px] rounded-3xl border border-charcoal/20 bg-white/70 p-6 text-center shadow-soft">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-charcoal/55">Innrspark</p>
        <h1 className="mt-3 text-3xl font-extrabold">{title}</h1>
        <p className="mt-3 text-sm font-medium text-charcoal/65">{route}</p>
        <p className="mt-6 text-sm text-charcoal/60">Phase 1.1 placeholder route</p>
      </section>
    </main>
  );
}
