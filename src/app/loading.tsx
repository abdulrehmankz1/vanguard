export default function Loading() {
  return (
    <main className="relative min-h-screen flex items-center justify-center px-6">
      <div className="flex flex-col items-center gap-6">
        <div className="relative w-16 h-16">
          <span className="absolute inset-0 rounded-full border border-foreground/20" />
          <span className="absolute inset-0 rounded-full border-t-2 border-accent animate-spin" />
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-foreground/50">
          Vanguard · Loading
        </span>
      </div>
    </main>
  );
}
